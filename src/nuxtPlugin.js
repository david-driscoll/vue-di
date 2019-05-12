import Vue from 'vue';
import { Container } from 'vue-di';
import VueDi from 'vue-di/vue';

export default (context, inject) => {
    const container = Container.instance || new Container();
    Vue.use(VueDi, { container });
    container.makeGlobal();
    context.container = context.app.container = container;
}
