export async function validateSchema(
  schema: any,
  object: any,
): Promise<boolean> {
  try {
    if (object === undefined) return false;
    await schema.validateAsync(object);
    return true;
  } catch (err) {
    throw err;
  }
}
