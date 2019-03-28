import hoistNonReactStatic from 'hoist-non-react-statics'
import { selectors as i18nSelectors } from './redux'
import { PureComponent, createElement } from 'react'
import invariant from 'invariant';
import PropTypes from 'prop-types'

export default () => (WrappedComponent) => {

  invariant(
    typeof WrappedComponent === 'function',
    `You must pass a component to the function returned by localize.
      Instead received ${JSON.stringify(WrappedComponent)}`
  )

  class WithI18n extends PureComponent {
    static contextTypes = {
      store: PropTypes.object.isRequired
    }

    constructor(props, context) {
      super(props, context)
      const store = this.context.store.getState();
      this.state = {
        lang: i18nSelectors.lang(store),
        t: (key, replacements, number) => i18nSelectors.t(store, { key, replacements, number })
      }
    }

    componentDidMount() {
      this.unsubscribe = this.context.store.subscribe(this.listener)
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    listener = () => {
      const store = this.context.store.getState();
      this.setState({
        lang: i18nSelectors.lang(store),
        t: (key, replacements, number) => i18nSelectors.t(store, { key, replacements, number })
      })
    }

    render() {
      return createElement(WrappedComponent, { ...this.props, ...this.state })
    }
  }

  return hoistNonReactStatic(WithI18n, WrappedComponent)
}