import React from 'react';
import ItemsSection from './ItemsSection';
import ItemsList from "./ItemsList";


export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sections: window.LOCATION_PARAMS,
        }
    }

    render() {
        return (
            <main>
                { this.state.sections.map((section, index) =>
                    <ItemsSection section={section}
                                  key={index}
                                  handleClickAction={this.props.handleClickAction}
                                  favorites={this.props.favorites}
                                  blacklist={this.props.blacklist} />
                )}

            </main>
        );
    }
}
