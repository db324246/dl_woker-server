module.exports.stringify = (data) => {
  if (typeof data === 'string') return data
  else return JSON.stringify(data)
}

module.exports.response = (status, message, data) => {
  const res = {
    status,
    message
  }

  data && (res.data = data)
  return res
}

module.exports.requiredParams = (keys, Obj) => {
  for (let i = 0, len = keys.length; i < len; i++) {
    if (!Obj[keys[i]]) return ({
      status: 400,
      message: `${keys[i]} is required`
    })  
  }
  return false
}

module.exports.currentTime = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, 0);
  const d = date.getDate().toString().padStart(2, 0);
  const h = date.getHours().toString().padStart(2, 0);
  const i = date.getMinutes().toString().padStart(2, 0);

  return `${y}-${m}-${d} ${h}:${i}`
}