import React from 'react'
// import { connect } from 'react-redux'
import translate, { localeId } from 'sp-i18n'
import { ImportStyle } from 'sp-css-import'
// import db from '@appLogic/database'
// import {
//     changeTab as equipmentDetailsChangeTab,
//     TABINDEX
// } from '@appLogic/infospage/api'
import { getInfosId } from '../../details'
import getLink from '@appUtils/get-link'

import Header from '@appUI/containers/infos-header'

// @connect((state, ownProps) => state.infosPage[getInfosId(ownProps.equipment.id)] || {})
@ImportStyle(require('./header.less'))
export default class EquipmentDetailsHeader extends React.Component {
    onTabChange(tabId, tabIndex) {
        if (typeof this.props.onTabChange === 'function')
            this.props.onTabChange(tabId, tabIndex)
        // this.props.dispatch(equipmentDetailsChangeTab(getInfosId(this.props.equipment.id), tabIndex))
    }

    getTabs() {
        if (!Array.isArray(this.props.tabs)) return []
        return this.props.tabs.map(tabId => ({
            tabId,
            tabName: translate("equipment_details." + tabId)
        }))
    }

    render() {
        if (!this.props.equipment) return null

        // currentIndex={this.props[TABINDEX]}
        return (
            <Header
                className={this.props.className}
                title={this.props.equipment._name}
                subtitle={this.props.equipment._type}
                tabs={this.getTabs()}
                urlBase={getLink('equipment', this.props.equipment.id)}
                defaultIndex={this.props.defaultTabIndex}
                onTabChange={this.onTabChange.bind(this)}
            >
                <span className="number">No.{this.props.equipment.id}</span>
                {localeId === 'ja' && <br />}
                {localeId !== 'ja' && <span className="name-ja">{this.props.equipment.getName(undefined, 'ja_jp')}</span>}
            </Header>
        )
    }
}