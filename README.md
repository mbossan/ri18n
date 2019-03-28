# Ri18n : i18n for React Redux made simple

## install

- npm
```bash
$ npm i @mbossan/ri18n --save
```
- yarn
```bash
$ yarn add @mbossan/ri18n
```

## usage

#### Setup your translation file

Translation file is a flat json key map
```json
{
  "key1":"translation2",
  "key2":"translation2"
}
```

#### Setup the reducer
```js
import {myReducer} from "./myReducer"
import {reducer as ri18n} from "@mbossan/ri18n"


const appReducer = combineReducers({
  myReducer,
  ri18n
})
```
With custom reducer name
```js
import {myReducer} from "./myReducer"
import {reducer as myI18nReducer, setReducerName} from "ri18n"
setReducerName('myI18nReducer')

const appReducer = combineReducers({
  myReducer,
  myI18nReducer
})
```



#### Load your translations
With Saga :
```js
import {actions as ri18nActions} from "@mbossan/ri18n"

//do loading process...

//then add 'en' translations to the ri18n state
yield put(ri18nActions.addTranslations('en', translations))
//switch lang to 'en' 
yield put(ri18nActions.setLang('en'))
```

#### API : 
actions : 
- addTranslations (lang, translations)
- setLang (lang)

selectors :
- lang(state) //current lang iso
- translations(state) // translations of current lang
- isLangAvailable(state, lang) 
- t(state, { key, replacements, number })

#### Decorate your view components with the localize HOC
```js
import {localize} from "@mbossan/ri18n"

@localize()
export default class MyComponent extends PureComponent{
  
}
```
or
```js
import {localize} from "@mbossan/ri18n"

class MyComponent extends PureComponent{
  
}

export default localize()(MyComponent)
```

#### Translate using the t function
```jsx harmony

import {localize} from "@mbossan/ri18n"

@localize()
export default class MyComponent extends PureComponent{
  
  render(){
    const {t} = this.props;
    return (
      <span>{t('key1')}</span>
    )
  }
}
```


#### Simple translate syntax :

```js
{
  greetings: "hello world"
}

t("greetings") //hello world
```

#### Variable replacement syntax :

```js
{
  greetings: "Hello {name}!"
}
t("greetings", {name: "Big Boss"}) //Hello Big Boss!
```

#### Pluralize syntax
```js
{
  text: "{0} There are no {items}!"+
  "|[1,3] You have one, two or three {items}."+
  "|{4} Four is a great number of {items}!" +
  "|[5,*]The number of {items} you have is uncountable!"
}

const replacements = {items:'books'}
t("text", replacements, 3)
//You have one, two or three books

t(key, replacements, number)