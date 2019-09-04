//  Based on https://gist.github.com/hurjas/2660489

/**
 * @param timestamp
 * @param format
 *
 *
 *     Y: Complete Year
 *     y: Two digits year
 *     M: Month
 *     D: Date
 *     H: Hour
 *     h: 12 hour format
 *     I: minutes
 *     S: seconds
 *     x: am / pm
 *
 */
export default function formatTimestamp(timestamp: any, format: string): string {
  function formatDate(format: string, pattern: string[] | any, dateContent: string[]): string {
    let patternArr = Array.isArray(pattern)
    let dataArr = Array.isArray(dateContent)
    let result = format.toString()
    if (patternArr) {
      let i: any = ''
      for (i in pattern) {
        let content: any
        content = dateContent[i] ? (dataArr ? dateContent[i] : dateContent) : dataArr ? '' : dateContent
        result = result.replace(new RegExp(pattern[i], 'g'), content)
      }
    } else {
      let content: any
      // @ts-ignore
      content = dataArr ? dateContent[0] : dateContent
      result = result.replace(new RegExp(pattern, 'g'), content)
    }
    return result
  }

  let date = timestamp ? new Date(timestamp * 1000) : new Date()

  const year = date.getFullYear().toString()
  const year2 = year.slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  let hour, hour2, x
  hour = hour2 = ('0' + date.getHours()).slice(-2).toString()
  if (date.getHours() > 12) {
    hour2 = (date.getHours() - 12).toString()
    x = 'pm'
  } else {
    x = 'am'
  }
  const min = ('0' + date.getMinutes()).slice(-2)
  const seg = ('0' + date.getSeconds()).slice(-2)
  return formatDate(format, 'YyMDHhISx'.split(''), [year, year2, month, day, hour, hour2, min, seg, x])
}
