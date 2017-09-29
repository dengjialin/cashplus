import React from 'react'
import {observable, action} from 'mobx'
class App {
    @observable barStyle = 'light-content'
    @action
    updateBarStyle = style => {
        this.barStyle = style
    }
}

export default new App()