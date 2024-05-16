function _get(path: string, obj = self, separator = '.') {
  const properties = Array.isArray(path) 
    ? path 
    : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj)
}

export default _get