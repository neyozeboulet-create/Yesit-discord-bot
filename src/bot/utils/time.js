function parseDuration(str){
  const m=str.match(/^(\d+)(s|m|h|d)$/i);
  if(!m) return null;
  const n=parseInt(m[1]);
  const mult={s:1000,m:60000,h:3600000,d:86400000}[m[2].toLowerCase()];
  return n*mult;
}
module.exports={parseDuration};
