
export const fillObjectFormCreate = async (page, objectData) => {
  await page.getByTestId('create-object-name').fill(objectData.name);
  await page.getByTestId('create-object-description').fill(objectData.description);
  await page.getByTestId('create-object-discipline').selectOption(objectData.discipline);
  await page.getByTestId('create-object-imageUrl').setInputFiles(objectData.imageUrl);
};

export const fillObjectFormUpdate = async (page, objectData) => {
  await page.getByTestId('edit-object-name').fill(objectData.name);
  await page.getByTestId('edit-object-description').fill(objectData.description);
  await page.getByTestId('edit-object-discipline').selectOption(objectData.discipline);
  if (objectData.imageUrl){
    await page.getByTestId('edit-object-imageUrl').setInputFiles(objectData.imageUrl);
  }

};



