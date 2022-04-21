"use strict";
var r = `\n    <h2>${Editor.T("KEYSTORE.new_keystore")}</h2>\n    <section>\n    \n        <ui-prop name="${Editor.T("KEYSTORE.keystore_password")}" v-bind:error="passwordError">\n            <ui-input class="flex-1" v-value="password" password v-bind:error="passwordError"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("SHARED.confirm_password")}" class="divide" v-bind:error="confirmPasswordError">\n            <ui-input class="flex-1"v-value="confirmPassword" password></ui-input>\n        </ui-prop>\n        \n        <div class="line"></div>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.keystore_alias")}" v-bind:error="aliasError">\n            <ui-input class="flex-1"v-value="alias"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.keystore_alias_password")}" v-bind:error="aliasPasswordError">\n            <ui-input class="flex-1"v-value="aliasPassword" password></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("SHARED.confirm_password")}" v-bind:error="confirmAliasPasswordError">\n            <ui-input class="flex-1"v-value="confirmAliasPassword" password></ui-input>\n        </ui-prop>\n\n        <div class="line"></div>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.validity")}" class="divide" v-bind:error="validityError">\n            <ui-num-input v-value="validity" min="1" step="1"></ui-num-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.name")}" v-bind:error="commonNameError">\n            <ui-input class="flex-1"v-value="commonName"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.organizational_unit")}" v-bind:error="organizationalUnitError">\n            <ui-input class="flex-1"v-value="organizationalUnit"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.organization")}" v-bind:error="organizationError">\n            <ui-input class="flex-1"v-value="organization"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.locality")}" v-bind:error="localityError">\n            <ui-input class="flex-1"v-value="locality"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.state")}" v-bind:error="stateError">\n            <ui-input class="flex-1"v-value="state"></ui-input>\n        </ui-prop>\n        \n        <ui-prop name="${Editor.T("KEYSTORE.country")}" v-bind:error="countryError">\n            <ui-input class="flex-1"v-value="country"></ui-input>\n        </ui-prop>\n    \n    </section>\n    \n    <footer class="group layout horizontal center">\n        <ui-button class="green" v-on:confirm="_onSaveClick">\n            ${Editor.T("SHARED.save")}\n        </ui-button>\n    </footer>\n`;
Editor.Panel.extend({
    _vm: null,
    style: "\n    :host {\n        overflow: auto;\n    }\n\n    h2 {\n        margin: 20px 20px 0 20px;\n        font-size: 26px;\n        color: #DDD;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n    \n    section {\n        margin: 0 10px;\n        padding: 15px;\n    }\n    \n    section .line {\n        margin: 8px 0;\n        border-bottom: 1px solid #666;\n    }\n    \n    footer {\n        padding: 10px 25px;\n        justify-content: flex-end;\n    }\n    \n    ui-prop[error] {\n        border-radius: 6px;\n        box-shadow: inset 0 0 20px 1px red;\n    }\n",
    template: r,
    messages: {},
    ready() {
        window.abc = this._vm = new window.Vue({
            el: this.shadowRoot,
            data: {
                password: "",
                confirmPassword: "",
                alias: "",
                aliasPassword: "",
                confirmAliasPassword: "",
                validity: 3650,
                commonName: "",
                organizationalUnit: "",
                organization: "",
                locality: "",
                state: "",
                country: "",
                passwordError: !1,
                confirmPasswordError: !1,
                aliasError: !1,
                aliasPasswordError: !1,
                confirmAliasPasswordError: !1,
                validityError: !1,
                commonNameError: !1,
                organizationalUnitError: !1,
                organizationError: !1,
                localityError: !1,
                stateError: !1,
                countryError: !1
            },
            watch: {
                password: {
                    handler() {
                        this.passwordError = !1, this.confirmPasswordError = !1
                    }
                },
                confirmPassword: {
                    handler() {
                        this.passwordError = !1, this.confirmPasswordError = !1
                    }
                },
                alias: {
                    handler() {
                        this.aliasError = !1
                    }
                },
                aliasPassword: {
                    handler() {
                        this.aliasPasswordError = !1, this.confirmAliasPasswordError = !1
                    }
                },
                confirmAliasPassword: {
                    handler() {
                        this.aliasPasswordError = !1, this.confirmAliasPasswordError = !1
                    }
                },
                validity: {
                    handler() {
                        this.validityError = !1
                    }
                },
                commonName: {
                    handler() {
                        this.commonNameError = !1
                    }
                },
                organizationalUnit: {
                    handler() {
                        this.organizationalUnitError = !1
                    }
                },
                organization: {
                    handler() {
                        this.organizationError = !1
                    }
                },
                locality: {
                    handler() {
                        this.localityError = !1
                    }
                },
                state: {
                    handler() {
                        this.stateError = !1
                    }
                },
                country: {
                    handler() {
                        this.countryError = !1
                    }
                }
            },
            methods: {
                _onSaveClick(r) {
                    if (r.stopPropagation(), (!this.password || this.password.length < 6) && (this.passwordError = !0, Editor.error(Editor.T("KEYSTORE.error.keystore_password_too_short"))), !this.confirmPassword && (this.confirmPasswordError = !0), this.password !== this.confirmPassword && (this.passwordError = !0, this.confirmPasswordError = !0, Editor.error(Editor.T("KEYSTORE.error.keystore_password_not_match"))), this.alias || (this.aliasError = !0, Editor.error(Editor.T("KEYSTORE.error.keystore_alias_empty"))), (!this.aliasPassword || this.aliasPassword.length < 6) && (this.aliasPasswordError = !0, Editor.error(Editor.T("KEYSTORE.error.keystore_password_too_short"))), !this.confirmAliasPassword && (this.confirmAliasPasswordError = !0), this.aliasPassword !== this.confirmAliasPassword && (this.aliasPasswordError = !0, this.confirmAliasPasswordError = !0, Editor.error(Editor.T("KEYSTORE.error.key_password_not_match"))), this.validity || (this.validityError = !0, Editor.error(Editor.T("KEYSTORE.error.key_validity_empty"))), !this.commonName && (this.commonNameError = !0), !this.organizationalUnit && (this.organizationalUnitError = !0), !this.organization && (this.organizationError = !0), !this.locality && (this.localityError = !0), !this.state && (this.stateError = !0), !this.country && (this.countryError = !0), !(this.commonName || this.organizationalUnit || this.organization || this.locality || this.state || this.country)) return Editor.error(Editor.T("KEYSTORE.error.publish_empty")), void 0;
                    if (!(this.passwordError || this.confirmPasswordError || this.aliasError || this.aliasPasswordError || this.confirmAliasPasswordError || this.validityError || this.commonNameError || this.organizationalUnitError || this.organizationError || this.localityError || this.stateError || this.countryError)) {
                        var o = Editor.Dialog.saveFile({
                            title: "Save keystore",
                            defaultPath: Editor.remote.Project.path,
                            filters: [{
                                name: "Keystore",
                                extensions: ["keystore"]
                            }]
                        });
                        o && -1 !== o && Editor.Ipc.sendToMain("app:save-keystore", {
                            dest: o,
                            password: this.password,
                            alias: this.alias,
                            aliasPassword: this.aliasPassword,
                            validity: this.validity,
                            commonName: this.commonName,
                            organizationalUnit: this.organizationalUnit,
                            organization: this.organization,
                            locality: this.locality,
                            state: this.state,
                            country: this.country
                        }, r => {
                            if (r) return Editor.error(r), void 0;
                            Editor.Ipc.sendToWins("keystore:created", {
                                path: o,
                                password: this.password,
                                alias: this.alias,
                                aliasPassword: this.aliasPassword
                            })
                        })
                    }
                }
            }
        })
    }
});
