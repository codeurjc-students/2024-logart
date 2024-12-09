
export const fillObjectForm = async (page, objectData) => {
  await page.getByTestId('create-object-name').fill(objectData.name);
  await page.getByTestId('create-object-description').fill(objectData.description);
  await page.getByTestId('create-object-discipline').selectOption(objectData.discipline);
  await page.getByTestId('create-object-imageUrl').setInputFiles(objectData.imageUrl);
};



