let x ="sdf123"
const number = ['0','1','2','3','4','5','6','7','8','9']

const t = [...x]
t.forEach(e=>{
    console.log(number.includes(e));
})