import { history } from 'super-project'

export default (uri) => {
    if (!__CLIENT__) return

    // console.log(
    //     (__SPA__ ? '' : location.pathname)
    //     + (uri.substr(0, 1) !== '/' ? '/' : '')
    //     + uri
    // )

    history.push(
        (uri.substr(0, 1) !== '/' ? '/' : '')
        + uri
    );
}
