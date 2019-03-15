class SubredditBase extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        showTooltip: false,
        subreddit: null,
      };

      this.showTooltip = this.showTooltip.bind(this);
      this.closeTooltip = this.closeTooltip.bind(this);
      this.tooltip = React.createRef();
    }

    setSubreddit(triggerTooltip=false) {
        let this_ = this;
        getSubreddit(this.props.subreddit, function(fetched_subreddit) {
          if (fetched_subreddit) {
            this_.setState({
                subreddit: fetched_subreddit,
                showTooltip: triggerTooltip
            });
          }
        });
    }

    showTooltip(event) {
      event.preventDefault();

      if (this.state.subreddit) {
        this.setState({ showTooltip: true }, () => {
          document.addEventListener('click', this.closeTooltip);
        });
      } else {
        this.setSubreddit(true);
      }
    }

    closeTooltip(event) {
        this.setState({ showTooltip: false }, () => {
            document.removeEventListener('click', this.closeTooltip);
        });
    }

    renderTooltip(showTooltip) {
        return (
            showTooltip ? (
                React.createElement('div', {
                    className: 'pffdxb-10 ikATnw bGIFnd'
                }, [
                    React.createElement('div', {
                        className: 'pffdxb-3 eLeKnM'
                    }, [
                        React.createElement('a', {
                            className: 'pffdxb-1 jUDXzN',
                            href: `http://www.reddit.com/${this.props.subreddit}`,
                            target: "_blank",
                        }, `${this.props.subreddit}`)
                    ]),
                    React.createElement('div', {
                        className: 'pffdxb-4 egysLp'
                    }, [
                        React.createElement('div', {
                            className: 'pffdxb-5 gqrTRv'
                        }, [
                            React.createElement('div', {
                                className: 'pffdxb-7 iJMTHi'
                            }, numToString(this.state.subreddit.subscribers)),
                            React.createElement('div', {
                                className: 'pffdxb-8 cdobkJ'
                            }, 'Subscribers')
                        ]),
                        React.createElement('div', {
                            className: 'pffdxb-6 czsqYP'
                        }, [
                            React.createElement('div', {
                                className: 'pffdxb-7 iJMTHi'
                            }, numToString(this.state.subreddit.active_user_count)),
                            React.createElement('div', {
                                className: 'pffdxb-8 cdobkJ'
                            }, 'Online')
                        ])
                    ]),
                    React.createElement('div', {
                        className: 'pffdxb-2 iHZaSo'
                    }, this.state.subreddit.public_description),
                    React.createElement('a', {
                        className: 's1w1mqsg-2 ifvzlp',
                        href: `http://www.reddit.com/${this.props.subreddit}`,
                        target: "_blank",
                    }, 'View Page')
                ])
            ): (
                null
            ));
    }
}

class SubredditText extends SubredditBase {
    render () {
        let tooltip = this.renderTooltip(this.state.showTooltip);
        return React.createElement('span', {
            onMouseEnter: this.showTooltip
        }, [
            React.createElement("a", {
                "className": "subreddit s1i3ufq7-0 bsfRLa",
                href: `http://www.reddit.com/${this.props.subreddit}`,
                target: "_blank",
            }, `${this.props.subreddit}`),
            React.createElement('div', {
                className: 'dMZkik',
                onMouseLeave: this.closeTooltip,
                ref: this.tooltip
            }, tooltip)
        ]);
    }
}

class SubredditPicture extends SubredditBase {
    render() {
        let img_src = '/images/generic_profile_picture.png';
        if (this.state.subreddit) {
            img_src = this.state.subreddit.community_icon ||
                this.state.subreddit.icon_img ||
                img_src;
        } else {
            this.setSubreddit(false);
        }
        let tooltip = this.renderTooltip(this.state.showTooltip);

        return React.createElement('span', {
            onMouseEnter: this.showTooltip
        }, [React.createElement("a", {
                href: `http://www.reddit.com/${this.props.subreddit}`,
                target: "_blank",
            }, React.createElement('img', {
                    src: img_src,
                    style: {
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                        display: 'inline-block',
                        height: '40px',
                        marginRight: '8px',
                        paddingBottom: '3px',
                        verticalAlign: 'middle',
                        width: '40px'
                    }
                })
            ), React.createElement('div', {
                    className: 'dMZkik',
                    onMouseLeave: this.closeTooltip,
                    ref: this.tooltip
                }, tooltip)
        ]);
    }
}

class Subreddit extends SubredditBase {
    render () {
        let tooltip = this.renderTooltip(this.state.showTooltip);
        return React.createElement('span', {
            onMouseEnter: this.showTooltip
        }, [
            React.createElement(SubredditPicture, {
                subreddit: this.props.subreddit
            }),
            React.createElement("a", {
                "className": "subreddit pffdxb-1 jUDXzN",
                href: `http://www.reddit.com/${this.props.subreddit}`,
                target: "_blank",
            }, `${this.props.subreddit}`),
            React.createElement('div', {
                className: 'dMZkik',
                onMouseLeave: this.closeTooltip,
                ref: this.tooltip
            }, tooltip)
        ]);
    }
}
