import React from 'react';
import ItemsSection from './ItemsSection';
import ItemsList from "./ItemsList";

const PARAMS = [
    {
        'id': 'ekb',
        'name': 'Екатеринбург',
        'location': 'area=3',
    },
    /*{
        'id': 'remote',
        'name': 'Удалённо',
        'location': 'schedule=remote'
    },*/
]

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sections: PARAMS,
        }
    }

    render() {
        return (
            <main>
                { this.state.sections.map((section, index) =>
                    <ItemsSection section={section}
                                  key={index}
                                  handleClickAction={this.props.handleClickAction}
                                  store={this.props.store} />
                )}
            </main>
        );
    }
}
