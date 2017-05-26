import React from 'react'
import { connect } from 'react-redux'

import translate from 'sp-i18n'
import db, { locale as dbLocaleId } from 'Logic/database'
import bindEvent from 'bind-event'
import {
    changeCollection,
    filterEnter,
    filterLeave,
    filterInput
} from 'Logic/ship-list/api.js'

import MainHeader from 'UI/components/main-header.jsx'
import Icon from 'UI/components/icon.jsx'

import { ImportStyle } from 'sp-css-import'
import styleHeader from './header.less'

@connect((state, ownProps) => state.shipList[ownProps.id])
@ImportStyle(styleHeader)
export default class ShipListHeader extends React.Component {
    componentWillUpdate(newProps) {
        const mainheader = this._wrapper.offsetParent

        if (newProps.isModeCompare) {
            mainheader.classList.remove('is-compare-leaving')
            mainheader.classList.add('is-compare')
            mainheader.setAttribute('data-compare-state', this.props.compareState)
        } else {
            mainheader.classList.add('is-compare-leaving')
            // mainheader.classList.remove('is-compare')
            // mainheader.removeAttribute('data-compare-state')
        }
    }

    componentDidMount() {
        bindEvent(
            this._wrapper.offsetParent,
            'animationend',
            function (evt) {
                if (evt.animationName === 'ship-list-header-compare-leave') {
                    evt.target.classList.remove('is-compare')
                    evt.target.classList.remove('is-compare-leaving')
                    evt.target.removeAttribute('data-compare-state')
                }
            }
        )
    }

    render() {
        return (
            <MainHeader className={
                this.props.className
                + (this.props.isModeFilter ? ' is-filtering' : '')
            }>
                <div className="wrapper" ref={el => this._wrapper = el}>
                    <div className="body">
                        <Filter id={this.props.id} />
                        <Tabs id={this.props.id} />
                        {this.props.extraButtons && <ExtraButtons>{this.props.extraButtons}</ExtraButtons>}
                    </div>
                    {typeof this.props.isModeCompare !== 'undefined' &&
                        <Compare
                            id={this.props.id}
                            onUpdateCompareState={this.props.onUpdateCompareState}
                            onResetCompareSelect={this.props.onResetCompareSelect}
                        />
                    }
                </div>
            </MainHeader>
        )
    }
}

import styleHeaderTabs from './header-tabs.less'
@connect((state, ownProps) => ({
    collection: state.shipList[ownProps.id].collection
}))
@ImportStyle(styleHeaderTabs)
class Tabs extends React.Component {
    onTabClick(collection) {
        this.props.dispatch(
            changeCollection(this.props.id, collection)
        )
    }
    onSelectChange(evt) {
        this.props.dispatch(
            changeCollection(this.props.id, parseInt(evt.target.value))
        )
    }
    render() {
        return (
            <div className={this.props.className}>
                <label className="select">
                    <select className="select-select" onChange={this.onSelectChange.bind(this)} value={this.props.collection}>
                        {db.shipCollections.map((collection, index) => (
                            <option
                                key={index}
                                value={index}
                            >
                                {collection.name[dbLocaleId]}
                            </option>
                        ))}
                    </select>
                    {this.props.collection > -1 && db.shipCollections[this.props.collection].name[dbLocaleId]}
                </label>
                {db.shipCollections.map((collection, index) => (
                    <span
                        key={index}
                        className={'link item' + (this.props.collection === index ? ' on' : '')}
                        onClick={() => {
                            this.onTabClick(index)
                        }}
                    >
                        {collection.name[dbLocaleId]}
                    </span>
                ))}
            </div>
        )
    }
}

// class TabItem extends React.Component {
//     render() {
//         return (
//             <span
//                 onClick={this.props.onClick}
//                 className={'link item' + this.props.className}
//             >
//                 {this.props.children}
//             </span>
//         )
//     }
// }

import styleHeaderFilter from './header-filter.less'
@connect((state, ownProps) => ({
    filterInput: state.shipList[ownProps.id].filterInput
}))
@ImportStyle(styleHeaderFilter)
class Filter extends React.Component {
    onInput(evt) {
        if (typeof this.debounceInput !== 'undefined') clearTimeout(this.debounceInput)
        let value = evt.target.value
        this.debounceInput = setTimeout(() => {
            this.props.dispatch(
                filterInput(this.props.id, value)
            )
        }, 100)
    }

    onFocus() {
        this.props.dispatch(
            filterEnter(this.props.id)
        )
    }

    onBlur(evt) {
        if (evt.target.value === '')
            this.props.dispatch(
                filterLeave(this.props.id)
            )
    }

    onCloseClick(/*evt*/) {
        this.el.value = ""
        this.el.dispatchEvent(new Event('input', { bubbles: true }))
        this.el.dispatchEvent(new Event('blur', { bubbles: true }))
        // evt.currentTarget.dispatchEvent(new Event('blur', { bubbles: true }))
    }

    render() {
        if (typeof this.defaultInput === 'undefined')
            this.defaultInput = this.props.filterInput
        return (
            <div className={this.props.className}>
                <Icon className="icon-search" icon="search" />
                <button className="close" onClick={this.onCloseClick.bind(this)}><Icon className="icon-close" icon="cross" /></button>
                <input
                    className="input"
                    type="text"
                    placeholder={translate('ship_list.filter.placeholder')}
                    onInput={this.onInput.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    defaultValue={this.defaultInput}
                    ref={(c) => this.el = c}
                />
            </div>
        )
    }
}

import styleHeaderExtraButtons from './header-extra-buttons.less'
@ImportStyle(styleHeaderExtraButtons)
class ExtraButtons extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                {this.props.children}
            </div>
        )
    }
}

import styleHeaderCompare from './header-compare.less'
@connect((state, ownProps) => ({
    isModeCompare: state.shipList[ownProps.id].isModeCompare,
    compareState: state.shipList[ownProps.id].compareState,
    compareList: state.shipList[ownProps.id].compareList
}))
@ImportStyle(styleHeaderCompare)
class Compare extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <div className="options">
                </div>
                <div className="header">
                    {this.props.compareState === 'selecting' && <div className="selecting">
                        <div className="wrapper">
                            {translate("ship_list.compare.selected", { count: this.props.compareList.length })}
                        </div>
                    </div>}
                </div>
            </div>
        )
    }
}