const buildTree = (categories, parentId = null) =>
  categories
    .filter(cat => cat.parentId === parentId)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      children: buildTree(categories, cat.id),
    }))

// A category id plus every descendant id — lets "filter by parent category"
// include products filed under any of its subcategories.
const collectDescendantIds = (categories, rootId) => {
  const ids = [rootId]
  const stack = [rootId]
  while (stack.length) {
    const current = stack.pop()
    for (const cat of categories) {
      if (cat.parentId === current) {
        ids.push(cat.id)
        stack.push(cat.id)
      }
    }
  }
  return ids
}

module.exports = { buildTree, collectDescendantIds }
