export const validateProduct = ({
    title,
    description,
    price,
    count,
}) => {
    const isValidTitle = typeof title === 'string' && title.length > 0;
    const isValidDescription = typeof description === 'string' && description.length > 0;
    const isValidPrice = typeof price === 'number' && price > 0;
    const isValidCount = typeof count === 'number' && count > 0;

  return isValidTitle && isValidDescription && isValidPrice && isValidCount;
}
