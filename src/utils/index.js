import store from '@/store'
import axios from 'axios'
import utils from '@/utils'

export default {
  getEnumName (code, value) {
    const dicts = store.state.dictStore.dicts[code]
    if (value) {
      const dict = dicts.find(item => item.info_code.trim() === value.trim())
      if (dict) {
        return dict.word_name
      } else {
        return ''
      }
    } else {
      return ''
    }
  },
  // 获得配置文件信息
  getConfig (key) {
    return process.env[key]
  },
  /**
   * 执行对象执行器方法
   * @param  {String} className  类编码
   * @param  {String} methodName 方法名称
   * @param  {Obj} paramObj 参数
   * @return {Obj} 返回值
   */
  execUtil (className, methodName, paramObj, paramHost) {
    let host = paramHost || utils.getConfig('VUE_APP_EXEO_HOST')
    // 连接bizDriver调用对象执行器
    return axios.post(host, {
      className, methodName, paramObj
    })
  },
  /**
   * 数组比较
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  arrContrast (arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1 !== arr2) {
        return false
      }
    }
    return true
  },
  // 给数字加上千分符
  // num:需要格式化的字符串数字
  // minFixedNum: 当num中的小数位小于minFixedNum，将补0
  handleNum (num, minFixedNum) {
    if (!num && num !== 0) {
      return ''
    } else {
      let intValue = String(num).split('.')
      intValue[0] = intValue[0].replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,')
      let returnVal = this.pastZero(intValue.join('.'))
      if (Number(minFixedNum)) {
        if (!String(returnVal).split('.')[1]) {
          returnVal = returnVal + '.'
          for (let i = 0; i < Number(minFixedNum); i++) {
            returnVal = returnVal + '0'
          }
        } else if (String(returnVal).split('.')[1].length < Number(minFixedNum)) {
          for (let i = 0; i < Number(minFixedNum) - String(returnVal).split('.')[1].length; i++) {
            returnVal = returnVal + '0'
          }
        }
      }
      return returnVal
    }
  },
  // 数字小数位后去0
  pastZero (num) {
    let intValue = String(num).split('.')
    if (!intValue[1]) {
      return num
    } else if (!Number(intValue[1])) {
      return intValue[0]
    }
    intValue[1] = Number('0.' + String(intValue[1]))
    intValue[1] = String(intValue[1]).split('.')[1]
    return intValue.join('.')
  },
  updateSessionStorageCrossTab (fromName) {
    return new Promise((resolve, reject) => {
      if (fromName) {
        if (!sessionStorage.length) {
          localStorage.setItem('getSessionStorage', Date.now())
        } else {
          resolve() // sessionStorage exist
        }
        window.addEventListener('storage', function (event) {
          console.log(event, '9876')
          if (event.key === 'getSessionStorage') {
            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage))
            localStorage.removeItem('sessionStorage')
          } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
            let data = JSON.parse(event.newValue)
            for (let key in data) {
              sessionStorage.setItem(key, data[key])
            }
            if (sessionStorage.length) {
              store.dispatch('userInfoStore/init').then(() => {
                resolve(1)
              })
            } else {
              resolve()
            }
          }
        })
      } else {
        resolve()
      }
    })
  }
}
