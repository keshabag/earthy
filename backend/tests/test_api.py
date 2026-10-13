
import pytest
from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_food_list_is_non_empty():
    response = client.get("/foods")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


def test_known_food_can_be_retrieved():
    foods = client.get("/foods").json()
    food_id = foods[0]["id"]

    response = client.get(f"/foods/{food_id}")

    assert response.status_code == 200
    assert response.json()["id"] == food_id


def test_unknown_food_returns_404():
    response = client.get("/foods/__missing_test_food__")
    assert response.status_code == 404


def test_nutrition_calculation_for_100_grams():
    foods = client.get("/foods").json()
    food = foods[0]

    response = client.post(
        "/nutrition/calculate",
        json={
            "ingredients": [
                {"food_id": food["id"], "grams": 100}
            ]
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["ingredients"]) == 1

    for nutrient, value in food["nutrients"].items():
        assert body["totals"][nutrient] == pytest.approx(
            value, abs=0.01
        )


def test_unknown_food_in_calculation_returns_404():
    response = client.post(
        "/nutrition/calculate",
        json={
            "ingredients": [
                {"food_id": "__missing_test_food__", "grams": 100}
            ]
        },
    )
    assert response.status_code == 404


def test_empty_ingredients_are_rejected():
    response = client.post(
        "/nutrition/calculate",
        json={"ingredients": []},
    )
    assert response.status_code == 422


@pytest.mark.parametrize("grams", [0, -1, -0.5])
def test_non_positive_portions_are_rejected(grams):
    food = client.get("/foods").json()[0]

    response = client.post(
        "/nutrition/calculate",
        json={
            "ingredients": [
                {"food_id": food["id"], "grams": grams}
            ]
        },
    )
    assert response.status_code == 422


def test_non_image_upload_is_rejected():
    response = client.post(
        "/meals/analyze-photo",
        files={
            "photo": ("test.txt", b"not an image", "text/plain")
        },
    )
    assert response.status_code == 400


def test_empty_image_upload_is_rejected():
    response = client.post(
        "/meals/analyze-photo",
        files={
            "photo": ("empty.png", b"", "image/png")
        },
    )
    assert response.status_code == 400
