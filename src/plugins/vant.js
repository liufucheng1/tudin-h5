import Vue from 'vue'
import {
    Button, 
    Field, 
    Toast, 
    Dialog, 
    Checkbox, 
    Icon, 
    Tabbar, 
    TabbarItem, 
    Loading, 
    Tab, 
    Tabs, 
    SwipeCell, 
    ActionSheet, 
    DatetimePicker, 
    Uploader, 
    RadioGroup, 
    Radio, 
    Cell,
    CellGroup,
    CheckboxGroup,
    Switch,
    Slider,
    Search,
    Form,
    Area,
    ImagePreview,
} from 'vant';
Vue.use(Button);
Vue.use(Field);
Vue.use(Dialog);
Vue.use(Checkbox);
Vue.use(Icon);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Loading);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(SwipeCell);
Vue.use(ActionSheet);
Vue.use(DatetimePicker);
Vue.use(Uploader);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Switch);
Vue.use(CheckboxGroup);
Vue.use(Slider)
Vue.use(Search)
Vue.use(Form)
Vue.use(Area)
// Vue.use(ImagePreview)
Vue.prototype.$imagePreview = ImagePreview
Vue.prototype.$Toast = Toast;
Vue.prototype.$Dialog = Dialog