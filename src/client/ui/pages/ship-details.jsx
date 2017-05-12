import React from 'react'
import { connect } from 'react-redux'

import translate from 'sp-i18n'
import PageContainer from 'sp-ui-pagecontainer'
import htmlHead from 'Utils/html-head.js'
import db from '../../logic/database'

import { ImportStyle } from 'sp-css-import'
import style from './ship-details.less'

@connect()
@ImportStyle(style)
export default class extends React.Component {
    static htmlExtends(ext, store) {
        const head = htmlHead({
            store,
            title: db.ships[store.getState().routing.locationBeforeTransitions.pathname.split('/').reverse()[0]]._name
        })

        ext.meta = ext.meta.concat(head.meta)
        ext.title = head.title
    }

    get data() {
        if (!this._data && this.props.params.id)
            this._data = db.ships[this.props.params.id]
        return this._data || {}
    }

    render() {
        if (__CLIENT__) console.log('thisShip', this.data)
        return (
            <PageContainer
                className={this.props.className}
            >
                <h2>{this.data._name}</h2>
                <p><i>{translate('under_construction')}...</i></p>
            </PageContainer>
        )
    }
}