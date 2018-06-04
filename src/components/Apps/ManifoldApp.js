import React, { Component } from 'react';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import PropTypes from 'prop-types';


class ManifoldAppComponent extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        let DeveloperComponent = this.props.developer_component
        return (
            <DeveloperComponent
                {...(this.props)}
            />
        )
    }

    
}

ManifoldAppComponent.propTypes = {
    developer_component: PropTypes.func.isRequired,
    pico_id: PropTypes.string.isRequired,
    eci: PropTypes.string.isRequired,
    bindings: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {}
}
//customEvent(eci, domain, type, attributes
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      manifoldEvent: (event, options) => {
        dispatch(commandAction(customEvent, [
            ownProps.eci,
            event.domain,
            event.type,
            event.attrs
        ], options))
      }
      
    }
}

export default function ManifoldApp(props) {
    let ConnectedManifoldApp = connect(mapStateToProps, mapDispatchToProps)(ManifoldAppComponent)
    return(
        <ConnectedManifoldApp
            {...props}
        />
    )
}

