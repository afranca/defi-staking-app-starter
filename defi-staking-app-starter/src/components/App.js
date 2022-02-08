import React, {Component} from "react";
import Navbar from "./Navbar";

class App extends Component{

    render(){
        return (
            <div>
                <Navbar/>
                <div className="text-center">
                    <h1>Hello orld</h1>
                </div>
            </div>
        )
    }
}

export default App;