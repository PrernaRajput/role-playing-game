import React from 'react';
import { OverlayPreloader } from '../overlayPreloader';

const DEFAULT_STATE = {
    showPreloader: false,
    opacity: 0.85
};

const pagePreloader = ( Component = OverlayPreloader ) => {
    class PagePreloader extends React.Component {
        constructor( props ) {

            super( props );

            this.__bind();

            this.state = DEFAULT_STATE;
        }

        __bind() {

            this.handleHidePreloader = this.handleHidePreloader.bind( this );
            this.handleShowPreloader = this.handleShowPreloader.bind( this );
        }


        componentDidMount() {
            window.addEventListener('Show_Preloader', this.handleShowPreloader);
            window.addEventListener('Hide_Preloader', this.handleHidePreloader);
        }
        
        componentWillUnmount() {
            window.removeEventListener('Show_Preloader', this.handleShowPreloader);
            window.removeEventListener('Hide_Preloader', this.handleHidePreloader);
        }


        handleShowPreloader() {

            if ( !this.state.showPreloader ) {
                this.setState( {
                    showPreloader: true
                } );
            }

        }

        handleHidePreloader() {

            this.setState( {
                showPreloader: false
            } );

        }

        /********************************************/

        render() {

            if ( this.state.showPreloader ) {
                return (
                    <div className='page-preloader' style={{ opacity: this.state.opacity }} >
                        <Component {...this.props} />
                    </div>
                );
            } else {
                return (
                    null
                );
            }

        }
    }

    // set display name
    PagePreloader.displayName = 'PagePreloader';

    // prop types
    PagePreloader.propTypes = {};

    // return component
    return PagePreloader;
};

// export HOC
export { pagePreloader };

// export react component with default view
export const PagePreloader = pagePreloader();
