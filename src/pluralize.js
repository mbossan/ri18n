/**
 * translation
 * @param translation
 * @param replacements
 * @return {*}
 * @private
 */
const _replace = (key, translation, replacements = {}) => {
  let replaced = translation
  if (!translation)
    return key
  if (!replacements)
    return translation
  Object.keys(replacements).forEach((replacement) => {
    replaced = replaced.split(`{${replacement}}`).join(replacements[replacement])
  })
  return replaced
}

/**
 * pluralization
 * @param translation
 * @param replacements
 * @param number
 * @return {*}
 * @private
 */
const _pluralize = (key, translation, replacements, number) => {

  if (number === undefined)
    return _replace(key, translation, replacements)

  if (!translation)
    return false

  const terms = translation.split('|');
  const regex = /^\s*({[0-9]+}|\[[0-9]+,([0-9]|Inf|inf|\*)*])\s*(.*)$/g;
  let matches;


  for (let i in terms) {

    if (!terms.hasOwnProperty(i)) {
      continue;
    }

    let term = terms[i];

    while ((matches = regex.exec(term)) !== null && matches.length) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      for (let groupIndex in matches) {

        if (!matches.hasOwnProperty(groupIndex)) {
          continue;
        }

        if (groupIndex !== "1") {
          continue;
        }

        const match = matches[groupIndex].substring(1, matches[groupIndex].length - 1).toLowerCase();
        if (match.indexOf(',') >= 0) {
          const between = match.split(',');
          const start = parseInt(between[0]) || Number.MIN_VALUE;
          const end = parseInt(between[1]) || Number.MAX_VALUE;

          if (number >= start && number <= end) {
            return _replace(key, matches[3], replacements)
          }
        } else if (parseInt(match) === number) {
          return _replace(key, matches[3], replacements)
        }
      }
    }
  }

  if (terms.length > 1)
    return _replace(key, terms[number < 2 ? 0 : 1], replacements)

  return _replace(key, translation, replacements);
}


export default _pluralize