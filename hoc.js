import hoistNonReactStatic from 'hoist-non-react-statics'
import { selectors as i18nSelectors } from './redux'
import { PureComponent } from 'react'
import { connect } from 'react-redux'

export default () => (WrappedComponent) => {

  class WithI18n extends PureComponent {
    render() {
      return <WrappedComponent {...this.props}/>
    }
  }

  const WithI18nClass = hoistNonReactStatic(WithI18n, WrappedComponent);

  const selectors = (state) => {
    return {
      lang: i18nSelectors.lang(state),
      t: (key, replacements, number) => i18nSelectors.t(state, { key, replacements, number })
    }
  }

  return connect(selectors)(WithI18nClass)
}