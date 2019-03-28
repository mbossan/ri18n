import { createAction, createReducer } from "redux-act";
import Immutable from "seamless-immutable";
import pluralize from './pluralize'

let reducerName = "ri18n"

export function setReducerName(name) {
  reducerName = name
}

//
// Initial state
//
const initialState = {
  lang: '',
  translations: {}
}

let immutableState = Immutable(initialState)

//
// Actions
//
export const actions = {
  setLang: createAction("ri18nSetLang", (lang) => ({ lang })),
  addTranslations: createAction("ri18nAddTranslations", (lang, translations) => ({ lang, translations })),
  reset: createAction("ri18nReset"),
}

//
// Reducer
//
export const reducer = createReducer({
  [actions.setLang]: (state, { lang }) => state.merge({ lang }),
  [actions.addTranslations]: (state, { lang, translations }) => state.setIn(['translations', lang], translations),
  [actions.reset]: (state) => state.merge(initialState),
}, immutableState)

//
// Selectors
//
const root = (state) => state[reducerName]
const lang = (state) => root(state).lang
const translations = (state) => isLangAvailable(state, lang(state)) ? root(state).translations[lang(state)] : {}
const isLangAvailable = (state, id) => root(state).translations && Object.keys(root(state).translations).includes(id)

const t = (state, { key, replacements, number }) => {
  const langKey = lang(state)
  if (!isLangAvailable(state, langKey)) {
    console.warn('[ri18n] Missing', '[' + langKey + '] in translation object')
    return key
  }
  const val = pluralize(key, translations(state)[key], replacements, number)
  if (val === false) {
    console.warn('[ri18n] Missing', '[' + langKey + ']', 'translation for key', key)
    return key
  }
  return val
}

export const selectors = {
  lang,
  translations,
  isLangAvailable,
  t
}

export default {
  actions,
  reducer,
  selectors,
  setReducerName
}