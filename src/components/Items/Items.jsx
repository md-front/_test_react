import React from 'react';
import ItemsSection from './ItemsSection';
import ItemsList from "./ItemsList";
import ItemsTitle from "./ItemsTitle";


export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sections: this.props.locations,
            activeSection: this.props.locations[0].id,
            activeQuantity: 0
        }

        this.handleLoaded = this.handleLoaded.bind(this);
        this.handleClickSectionTitle = this.handleClickSectionTitle.bind(this);
    }

    handleClickSectionTitle(id) {
        this.setState({ activeQuantity: 0, activeSection: id });
    }
    handleLoaded(activeQuantity) {
        this.setState({ activeQuantity });
    }

    render() {
        return (
            <main>
                <div className="nav">
                    { this.state.sections.map((section, index) =>
                        <ItemsTitle section={ section }
                                    quantity={ this.state.activeQuantity }
                                    isActive={ section.id === this.state.activeSection }
                                    handleClick={ this.handleClickSectionTitle }
                                    key={ index } />
                    )}
                </div>
                { this.state.sections.map((section, index) =>
                    section.id === this.state.activeSection &&
                    <ItemsSection section={ section }
                                  key={ index }
                                  handleLoaded={ this.handleLoaded }
                                  handleClickAction={ this.props.handleClickAction }
                                  favorites={ this.props.favorites }
                                  blacklist={ this.props.blacklist } />
                )}
            </main>
        );
    }
}
