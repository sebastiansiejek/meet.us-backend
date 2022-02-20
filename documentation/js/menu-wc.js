'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">meet documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-01ed39045607faf44e4b83ba698ddd57b13412874948c0c651ff1b7bb36920e8302d8e16dac4a8568efd8f6f5d98088e0090ad261188cb397dcb6ee093a7f264"' : 'data-target="#xs-injectables-links-module-AuthModule-01ed39045607faf44e4b83ba698ddd57b13412874948c0c651ff1b7bb36920e8302d8e16dac4a8568efd8f6f5d98088e0090ad261188cb397dcb6ee093a7f264"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-01ed39045607faf44e4b83ba698ddd57b13412874948c0c651ff1b7bb36920e8302d8e16dac4a8568efd8f6f5d98088e0090ad261188cb397dcb6ee093a7f264"' :
                                        'id="xs-injectables-links-module-AuthModule-01ed39045607faf44e4b83ba698ddd57b13412874948c0c651ff1b7bb36920e8302d8e16dac4a8568efd8f6f5d98088e0090ad261188cb397dcb6ee093a7f264"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CompaniesModule.html" data-type="entity-link" >CompaniesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CompaniesModule-21446adccfe0358c4569f1ef9cdd07b53e3edcb76a860a09080d526b8295a2aead71aa51801af6d89eaf6e6304ff6330d562375a0aef0071a9d4f86abe463fc9"' : 'data-target="#xs-injectables-links-module-CompaniesModule-21446adccfe0358c4569f1ef9cdd07b53e3edcb76a860a09080d526b8295a2aead71aa51801af6d89eaf6e6304ff6330d562375a0aef0071a9d4f86abe463fc9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CompaniesModule-21446adccfe0358c4569f1ef9cdd07b53e3edcb76a860a09080d526b8295a2aead71aa51801af6d89eaf6e6304ff6330d562375a0aef0071a9d4f86abe463fc9"' :
                                        'id="xs-injectables-links-module-CompaniesModule-21446adccfe0358c4569f1ef9cdd07b53e3edcb76a860a09080d526b8295a2aead71aa51801af6d89eaf6e6304ff6330d562375a0aef0071a9d4f86abe463fc9"' }>
                                        <li class="link">
                                            <a href="injectables/CompaniesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompaniesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventsModule.html" data-type="entity-link" >EventsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EventsModule-35cf0b4bb373ddae0bafe651744fb8acc0d15d821ddf8dee6037e866a21dccece45b31c49437c448344ccfa2c2dc3a72ffe78a3c082f7e2913d7502960c97df0"' : 'data-target="#xs-injectables-links-module-EventsModule-35cf0b4bb373ddae0bafe651744fb8acc0d15d821ddf8dee6037e866a21dccece45b31c49437c448344ccfa2c2dc3a72ffe78a3c082f7e2913d7502960c97df0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EventsModule-35cf0b4bb373ddae0bafe651744fb8acc0d15d821ddf8dee6037e866a21dccece45b31c49437c448344ccfa2c2dc3a72ffe78a3c082f7e2913d7502960c97df0"' :
                                        'id="xs-injectables-links-module-EventsModule-35cf0b4bb373ddae0bafe651744fb8acc0d15d821ddf8dee6037e866a21dccece45b31c49437c448344ccfa2c2dc3a72ffe78a3c082f7e2913d7502960c97df0"' }>
                                        <li class="link">
                                            <a href="injectables/EventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MailModule-842015ed92b7de0f889f8142b223589a8eedee7a53b69aff9579bca8d423ec6d56e8168e13e3972ae45be526b38ca0bce0e2f1462ad913c4a9aa9bf0f7a9d9ac"' : 'data-target="#xs-injectables-links-module-MailModule-842015ed92b7de0f889f8142b223589a8eedee7a53b69aff9579bca8d423ec6d56e8168e13e3972ae45be526b38ca0bce0e2f1462ad913c4a9aa9bf0f7a9d9ac"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-842015ed92b7de0f889f8142b223589a8eedee7a53b69aff9579bca8d423ec6d56e8168e13e3972ae45be526b38ca0bce0e2f1462ad913c4a9aa9bf0f7a9d9ac"' :
                                        'id="xs-injectables-links-module-MailModule-842015ed92b7de0f889f8142b223589a8eedee7a53b69aff9579bca8d423ec6d56e8168e13e3972ae45be526b38ca0bce0e2f1462ad913c4a9aa9bf0f7a9d9ac"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NotificationsModule-b373dde8ea0050e3f6b3b81988c275586907af7337aa62eecc25889fe4e3dcdb4b315b59d2683cf2937bb826ae2c5b8839425c4f92ab0753f0b33bc941adf5ae"' : 'data-target="#xs-injectables-links-module-NotificationsModule-b373dde8ea0050e3f6b3b81988c275586907af7337aa62eecc25889fe4e3dcdb4b315b59d2683cf2937bb826ae2c5b8839425c4f92ab0753f0b33bc941adf5ae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-b373dde8ea0050e3f6b3b81988c275586907af7337aa62eecc25889fe4e3dcdb4b315b59d2683cf2937bb826ae2c5b8839425c4f92ab0753f0b33bc941adf5ae"' :
                                        'id="xs-injectables-links-module-NotificationsModule-b373dde8ea0050e3f6b3b81988c275586907af7337aa62eecc25889fe4e3dcdb4b315b59d2683cf2937bb826ae2c5b8839425c4f92ab0753f0b33bc941adf5ae"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParticipantsModule.html" data-type="entity-link" >ParticipantsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ParticipantsModule-d4b59f99c097f17c1728cbb215414de12c7b36a1dd693387b282bf49ddcc5e4cf80eb7d7fe7c3f8954d979068a46b85cf37d73026f7bfe2bb85e767c627b23d5"' : 'data-target="#xs-injectables-links-module-ParticipantsModule-d4b59f99c097f17c1728cbb215414de12c7b36a1dd693387b282bf49ddcc5e4cf80eb7d7fe7c3f8954d979068a46b85cf37d73026f7bfe2bb85e767c627b23d5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParticipantsModule-d4b59f99c097f17c1728cbb215414de12c7b36a1dd693387b282bf49ddcc5e4cf80eb7d7fe7c3f8954d979068a46b85cf37d73026f7bfe2bb85e767c627b23d5"' :
                                        'id="xs-injectables-links-module-ParticipantsModule-d4b59f99c097f17c1728cbb215414de12c7b36a1dd693387b282bf49ddcc5e4cf80eb7d7fe7c3f8954d979068a46b85cf37d73026f7bfe2bb85e767c627b23d5"' }>
                                        <li class="link">
                                            <a href="injectables/ParticipantsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParticipantsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RatingsModule.html" data-type="entity-link" >RatingsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RatingsModule-d467ada1f7a1a6c413d82b030acfce0451977cc7e916e797d514145f43eac10be8cc2106b0021997a051d6928c88e33a47587ab8a50bab440bc895b0ce2f789b"' : 'data-target="#xs-injectables-links-module-RatingsModule-d467ada1f7a1a6c413d82b030acfce0451977cc7e916e797d514145f43eac10be8cc2106b0021997a051d6928c88e33a47587ab8a50bab440bc895b0ce2f789b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RatingsModule-d467ada1f7a1a6c413d82b030acfce0451977cc7e916e797d514145f43eac10be8cc2106b0021997a051d6928c88e33a47587ab8a50bab440bc895b0ce2f789b"' :
                                        'id="xs-injectables-links-module-RatingsModule-d467ada1f7a1a6c413d82b030acfce0451977cc7e916e797d514145f43eac10be8cc2106b0021997a051d6928c88e33a47587ab8a50bab440bc895b0ce2f789b"' }>
                                        <li class="link">
                                            <a href="injectables/RatingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RatingsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TagsModule.html" data-type="entity-link" >TagsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TagsModule-3a33eed8d0a1d959922e1bd62d3aaee3228b5027f053f47c1f03b716a9e97996de0b41cfd455e9198a0b1eb88b88598a1af58784fd1fc9caeb11c3a99820e688"' : 'data-target="#xs-injectables-links-module-TagsModule-3a33eed8d0a1d959922e1bd62d3aaee3228b5027f053f47c1f03b716a9e97996de0b41cfd455e9198a0b1eb88b88598a1af58784fd1fc9caeb11c3a99820e688"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TagsModule-3a33eed8d0a1d959922e1bd62d3aaee3228b5027f053f47c1f03b716a9e97996de0b41cfd455e9198a0b1eb88b88598a1af58784fd1fc9caeb11c3a99820e688"' :
                                        'id="xs-injectables-links-module-TagsModule-3a33eed8d0a1d959922e1bd62d3aaee3228b5027f053f47c1f03b716a9e97996de0b41cfd455e9198a0b1eb88b88598a1af58784fd1fc9caeb11c3a99820e688"' }>
                                        <li class="link">
                                            <a href="injectables/TagsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserActivityModule.html" data-type="entity-link" >UserActivityModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserActivityModule-11a320b5d4354332eef568cdd12fffbe98edff1926462931d8a5edb4d56d323188c392cdc5ab4f09de9a17c8c33092ee813bcc31aebc0a28c709522f8a2ff6fa"' : 'data-target="#xs-injectables-links-module-UserActivityModule-11a320b5d4354332eef568cdd12fffbe98edff1926462931d8a5edb4d56d323188c392cdc5ab4f09de9a17c8c33092ee813bcc31aebc0a28c709522f8a2ff6fa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserActivityModule-11a320b5d4354332eef568cdd12fffbe98edff1926462931d8a5edb4d56d323188c392cdc5ab4f09de9a17c8c33092ee813bcc31aebc0a28c709522f8a2ff6fa"' :
                                        'id="xs-injectables-links-module-UserActivityModule-11a320b5d4354332eef568cdd12fffbe98edff1926462931d8a5edb4d56d323188c392cdc5ab4f09de9a17c8c33092ee813bcc31aebc0a28c709522f8a2ff6fa"' }>
                                        <li class="link">
                                            <a href="injectables/UserActivityService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserActivityService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-396228a712d9b97aba2d35a8b6f4bc1cd7c2159d16c90b71870f79642c2326a5ea044188bc02087d40ffb51e450447b315de2aa19faf81af9e6b6be340a0614c"' : 'data-target="#xs-injectables-links-module-UsersModule-396228a712d9b97aba2d35a8b6f4bc1cd7c2159d16c90b71870f79642c2326a5ea044188bc02087d40ffb51e450447b315de2aa19faf81af9e6b6be340a0614c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-396228a712d9b97aba2d35a8b6f4bc1cd7c2159d16c90b71870f79642c2326a5ea044188bc02087d40ffb51e450447b315de2aa19faf81af9e6b6be340a0614c"' :
                                        'id="xs-injectables-links-module-UsersModule-396228a712d9b97aba2d35a8b6f4bc1cd7c2159d16c90b71870f79642c2326a5ea044188bc02087d40ffb51e450447b315de2aa19faf81af9e6b6be340a0614c"' }>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Company.html" data-type="entity-link" >Company</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Event.html" data-type="entity-link" >Event</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EventAddress.html" data-type="entity-link" >EventAddress</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Participant.html" data-type="entity-link" >Participant</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Rating.html" data-type="entity-link" >Rating</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Tag.html" data-type="entity-link" >Tag</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserActivity.html" data-type="entity-link" >UserActivity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccessToken.html" data-type="entity-link" >AccessToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActivateUserInput.html" data-type="entity-link" >ActivateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CompaniesResolver.html" data-type="entity-link" >CompaniesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Company.html" data-type="entity-link" >Company</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConnectionArgs.html" data-type="entity-link" >ConnectionArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCompanyInput.html" data-type="entity-link" >CreateCompanyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEventAddress.html" data-type="entity-link" >CreateEventAddress</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEventAddressInput.html" data-type="entity-link" >CreateEventAddressInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEventInput.html" data-type="entity-link" >CreateEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEvents.html" data-type="entity-link" >CreateEvents</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateParticipants.html" data-type="entity-link" >CreateParticipants</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTags.html" data-type="entity-link" >CreateTags</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserInput.html" data-type="entity-link" >CreateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUsers.html" data-type="entity-link" >CreateUsers</a>
                            </li>
                            <li class="link">
                                <a href="classes/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventAddress.html" data-type="entity-link" >EventAddress</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventResponse.html" data-type="entity-link" >EventResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventsResolver.html" data-type="entity-link" >EventsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/GqlAuthGuard.html" data-type="entity-link" >GqlAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/isValid.html" data-type="entity-link" >isValid</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserInput.html" data-type="entity-link" >LoginUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageData.html" data-type="entity-link" >PageData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Participant.html" data-type="entity-link" >Participant</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantByDateListResponse.html" data-type="entity-link" >ParticipantByDateListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantByDateResponse.html" data-type="entity-link" >ParticipantByDateResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantListResponse.html" data-type="entity-link" >ParticipantListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantResponse.html" data-type="entity-link" >ParticipantResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantsResolver.html" data-type="entity-link" >ParticipantsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantUpdate.html" data-type="entity-link" >ParticipantUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rating.html" data-type="entity-link" >Rating</a>
                            </li>
                            <li class="link">
                                <a href="classes/RatingListResponse.html" data-type="entity-link" >RatingListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/RatingResponse.html" data-type="entity-link" >RatingResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/RatingsResolver.html" data-type="entity-link" >RatingsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RatingUpdate.html" data-type="entity-link" >RatingUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshUserToken.html" data-type="entity-link" >RefreshUserToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordInput.html" data-type="entity-link" >ResetPasswordInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordTokenInput.html" data-type="entity-link" >ResetPasswordTokenInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetResponse.html" data-type="entity-link" >ResetResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tag.html" data-type="entity-link" >Tag</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagsResolver.html" data-type="entity-link" >TagsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCompanyInput.html" data-type="entity-link" >UpdateCompanyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEventInput.html" data-type="entity-link" >UpdateEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserInput.html" data-type="entity-link" >UpdateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserActivity.html" data-type="entity-link" >UserActivity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserActivitySave.html" data-type="entity-link" >UserActivitySave</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolver.html" data-type="entity-link" >UsersResolver</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/QueryResolver.html" data-type="entity-link" >QueryResolver</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QueryResolver-1.html" data-type="entity-link" >QueryResolver</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});