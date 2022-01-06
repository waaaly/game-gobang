
function isWin(curColorArray){
    let res = {}
    curColorArray.map((item, index) => {
        let c0c = c0(item, [...curColorArray])
        let c45c = c45(item, [...curColorArray])
        let c90c = c90(item, [...curColorArray])
        let c135c = c135(item, [...curColorArray])
        if (c0c && c0c.length >= 4) {
            res = {
                status: true,
                arr: c0c
            }
            console.log("c0 isWin...........")
        }
        if (c45c && c45c.length >= 4) {
            res = {
                status: true,
                arr: c45c
            }
            console.log("c45 isWin...........")
        }
        if (c90c && c90c.length >= 4) {
            res = {
                status: true,
                arr: c90c
            }
            console.log("c90 isWin...........")
        }
        if (c135c && c135c.length >= 4) {
            res = {
                status: true,
                arr: c135c
            }
            console.log("c135 isWin...........")
        }
    })
    if(res.status){
        return true
    }else{
        return false
    }
}

function c0(item, array) {
    let arr = [item]
    let a1 = array.filter(e => (e[0] === item[0] && e[1] === item[1] + 30))
    if (a1.length > 0) {
        arr.push(a1[0])
        let a2 = array.filter(e => (e[0] === a1[0][0] && e[1] === a1[0][1] + 30))
        if (a2.length > 0) {
            arr.push(a2[0])
            let a3 = array.filter(e => (e[0] === a2[0][0] && e[1] === a2[0][1] + 30))
            if (a3.length > 0) {
                arr.push(a3[0])
                let a4 = array.filter(e => (e[0] === a3[0][0] && e[1] === a3[0][1] + 30))
                if (a4.length > 0) {
                    arr.push(a4[0])
                    return arr
                }
            }
        }
    }
}

function c45(item, array) {
    let arr = [item]
    let a1 = array.filter(e => (e[0] === item[0] - 30 && e[1] === item[1] -30))
    if (a1.length > 0) {
        arr.push(a1[0])
        let a2 = array.filter(e => (e[0] === a1[0][0] - 30 && e[1] === a1[0][1] -30))
        if (a2.length > 0) {
            arr.push(a2[0])
            let a3 = array.filter(e => (e[0] === a2[0][0] - 30 && e[1] === a2[0][1] -30))
            if (a3.length > 0) {
                arr.push(a3[0])
                let a4 = array.filter(e => (e[0] === a3[0][0] - 30 && e[1] === a3[0][1] -30))
                if (a4.length > 0) {
                    arr.push(a4[0])
                    return arr
                }
            }
        }
    }
}

function c90(item, array) {
    let arr = [item]
    let a1 = array.filter(e => (e[0] === item[0] - 30 && e[1] === item[1] ))
    if (a1.length > 0) {
        arr.push(a1[0])
        let a2 = array.filter(e => (e[0] === a1[0][0] - 30 && e[1] === a1[0][1] ))
        if (a2.length > 0) {
            arr.push(a2[0])
            let a3 = array.filter(e => (e[0] === a2[0][0] - 30 && e[1] === a2[0][1]))
            if (a3.length > 0) {
                arr.push(a3[0])
                let a4 = array.filter(e => (e[0] === a3[0][0] - 30 && e[1] === a3[0][1]))
                if (a4.length > 0) {
                    arr.push(a4[0])
                    return arr
                }
            }
        }
    }
}

function c135(item, array) {
    let arr = [item]
    let a1 = array.filter(e => (e[0] === item[0] - 30 && e[1] === item[1] + 30))
    if (a1.length > 0) {
        arr.push(a1[0])
        let a2 = array.filter(e => (e[0] === a1[0][0] - 30 && e[1] === a1[0][1] + 30))
        if (a2.length > 0) {
            arr.push(a2[0])
            let a3 = array.filter(e => (e[0] === a2[0][0] - 30 && e[1] === a2[0][1] + 30))
            if (a3.length > 0) {
                arr.push(a3[0])
                let a4 = array.filter(e => (e[0] === a3[0][0] - 30 && e[1] === a3[0][1] + 30))
                if (a4.length > 0) {
                    arr.push(a4[0])
                    return arr
                }
            }
        }
    }
}