module.exports.stringify = (data) => {
  if (typeof data === 'string') return data
  else return JSON.stringify(data)
}