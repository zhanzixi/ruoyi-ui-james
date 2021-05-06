function build(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || Math.min(...data.map(item => item[parentId])) || 0


  let treeData = data.filter(item => item[parentId] === rootId)
  treeData.forEach(item => {
    item[children] = build(data, id, parentId, children, item.id)
  })
  return treeData
}

export function buildTree(data, id, parentId, children, rootId) {
  let cloneData = JSON.parse(JSON.stringify(data))
  return build(cloneData, id, parentId, children, rootId)
}

export function buildBreadcrumbMap(data, key, value, id, parentId, arrTitle, rootId) {
  let cloneData = JSON.parse(JSON.stringify(data))
  let map = new Map()

  function buildBreadcrumb(data, key = 'path', value = 'name', id = 'id', parentId = 'parentId', arrTitle = [], rootId = 0) {
    data.filter(item => item[parentId] === rootId).forEach(item => {
      map.set(item.path, arrTitle.concat([item.name]))
      buildBreadcrumb(data, key, value, id, parentId, arrTitle.concat([item.name]), item.id)
    })
  }

  buildBreadcrumb(cloneData, key, value, id, parentId, arrTitle, rootId)
  return map
}

export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}
