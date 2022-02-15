"use strict";Vue.component("cc-label",{dependencies:["packages://inspector/share/blend.js"],template:'\n    <ui-prop\n      v-prop="target.string"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.horizontalAlign"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.verticalAlign"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-prop="target.actualFontSize"\n      v-show="!_hiddenActualFontSize()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop type="number"\n      v-prop="target.fontSize">\n      :multi-values="multi"\n    </ui-prop>\n    <ui-prop\n      v-prop="target._bmFontOriginalSize"\n      v-show="_isBMFont()"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-prop="target.lineHeight"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.spacingX"\n      v-show="_isBMFont()"  \n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.overflow"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.enableWrapText"\n      v-show="!_hiddenWrapText()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.font"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.fontFamily"\n      v-show="_isSystemFont()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.enableBold"\n      v-show="!_isBMFont()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.enableItalic"\n      v-show="!_isBMFont()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.enableUnderline"\n      v-show="!_isBMFont()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.underlineHeight"\n      v-show="!_isBMFont() && target.enableUnderline.value === true"\n      :indent="1"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.cacheMode"\n      v-show="!_isBMFont()"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.useSystemFont"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <cc-array-prop :target.sync="target.materials"></cc-array-prop>\n  ',props:{target:{twoWay:!0,type:Object},multi:{type:Boolean}},methods:{T:Editor.T,_isBMFont(){return this.target._bmFontOriginalSize.value>0},_isSystemFont(){return this.target.useSystemFont.value},_hiddenWrapText(){let t=this.target.overflow.value;return 0===t||3===t},_hiddenActualFontSize(){return 2!==this.target.overflow.value}}});