import { faker } from "@faker-js/faker";
// Using faker library to generate mock data
function generateRentalItem() {
  let toss = Math.random();
  let type = "";
  if (toss > 0.5) {
    type = "hourly";
  } else {
    type = "daily";
  }

  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    img_url: faker.image.urlLoremFlickr({ category: "technology" }),
    user_reviews: faker.number.float({ min: 0, max: 5 }),
    description: faker.commerce.productDescription(),
    location: faker.location.city(),
    price: faker.commerce.price({ min: 5, max: 200 }),
    type: type,
  };
}

export default generateRentalItem;
