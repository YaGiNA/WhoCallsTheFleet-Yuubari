import React from 'react'
import { extend } from 'koot'

import ListShips from '@ui/components/list/ships'
import ListItem from './list-item'

const ShipListList = extend({
    styles: require('./list.less')
})(
    ({ className, ships, id, onCompareSelect }) => (
        <ListShips className={className}>
            {ships.map((ship, index) => (
                <ListItem
                    shipListId={id}
                    ship={ship}
                    key={index}

                    onCompareSelect={onCompareSelect}
                />
            ))}
        </ListShips>
    )
)

export default ShipListList
