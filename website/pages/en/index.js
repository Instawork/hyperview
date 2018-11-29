/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    Native mobile apps,
    <br />
    as easy as creating a website.
    <small>
    Hyperview is a new hypermedia format and cross-platform client
    <br />
    for developing server-driven mobile apps.
    </small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="https://github.com/instawork/hyperview">Try It Out</Button>
            <Button href={docUrl('guide_introduction', language)}>Learn more</Button>
            <Button href={docUrl('example_navigation', language)}>Examples</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Feature = (props) => (
  <Container
    background={props.background}
    padding={['bottom', 'top']}
    className={props.align == 'left' ? 'container-left' : 'container-right'}
  >
    <div className="featureContent">
      <h3>{props.title}</h3>
      <MarkdownBlock>{props.content}</MarkdownBlock>
    </div>
    <div className="featureImage">
      <img src={props.image} />
    </div>
  </Container>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Feature
            align="left"
            background="light"
            title="Update your apps instantly by deploying your backend"
            content="Say goodbye to slow release cycles and long app store review times. With Hyperview, your backend controls your app&apos;s layout, content, and available actions. The means you can update any aspect of your app with a server-side change. True CI/CD is finally attainable for mobile development."
            image={imgUrl('home/deploy.svg')}
          />
          <Feature
            align="right"
            background="light"
            title="Forget about API versioning and backwards compatibility"
            content="Unlike traditional native apps, every user always runs the most recent version of your code. With no version fragmentation, you can be more productive by eliminating the need to support and maintain older app versions."
            image={imgUrl('home/version.svg')}
          />
          <Feature
            align="left"
            background="light"
            title="Use a familiar but powerful declarative syntax"
            content="Developers familiar with HTML or React's JSX will feel comfortable with [Hyperview XML (HXML)](/docs/guide_html). Unlike HTML, HXML&apos;s elements map to the building blocks of mobile interfaces. HXML&apos;s [behavior syntax](/docs/reference_behavior_attributes) supports [sophisticated user interactions](/docs/example_tabs) without client-side scripting."
            image={imgUrl('home/syntax.svg')}
          />
          <Feature
            align="right"
            background="light"
            title="Work with any backend web technology"
            content="Use battle-tested web technologies like Django, Rails, or Node. Any HTTP server can host a Hyperview app. You can even deploy your app as a collection of static XML files if you want!"
            image={imgUrl('home/backend.svg')}
          />
        </div>

        <Container padding={['bottom']} className="comparison">
          <h3>The best choice for networked mobile apps</h3>

          <p className="comparison__info">
Hyperview is a great fit for network-based mobile applications, such as social networks, marketplaces, media/content browsing, etc. If your app relies on offline access or storing data locally, Hyperview won't be the right choice. But any app that reads and writes data to the cloud can greatly benefit from Hyperview's unique combination of features.
          </p>
      
          <table className="comparison__table">
            <thead>
              <tr>
                <th></th>
                <th>Hyperview</th>
                <th>Native</th>
                <th>HTML5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Native UI</th>
                <td>Yes</td>
                <td>Yes</td>
                <td></td>
              </tr>
              <tr>
                <th>Instant Updates</th>
                <td>Yes</td>
                <td></td>
                <td>Yes</td>
              </tr>
              <tr>
                <th>System integrations</th>
                <td>Yes</td>
                <td>Yes</td>
                <td></td>
              </tr>
              <tr>
                <th>Local/offline data</th>
                <td></td>
                <td>Yes</td>
                <td>Some</td>
              </tr>
            </tbody>
          </table>

        </Container>
      </div>
    );
  }
}

module.exports = Index;
