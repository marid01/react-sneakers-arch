import React from 'react';
import {Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer/Drawer';
import AppContext from "./context";

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from "./pages/Orders";




function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);


    React.useEffect(() => {

        async function fetchData() {
            // TODO: Сделать try catch + Promise.all
            const cartResponse = await axios.get('https://60ec2df4e9647b0017cde0e0.mockapi.io/cart');
            const favoritesResponse = await axios.get('https://60ec2df4e9647b0017cde0e0.mockapi.io/favorites');
            const itemsResponse = await axios.get('https://60ec2df4e9647b0017cde0e0.mockapi.io/items');

            setIsLoading(false);
            setCartItems(cartResponse.data);
            setFavorites(favoritesResponse.data);
            setItems(itemsResponse.data);
        }

        fetchData();
    }, []);

    const onAddToCart = (obj) => {
        // debugger
        console.log(obj)
        if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            console.log(obj.id)
            axios.delete(`https://60ec2df4e9647b0017cde0e0.mockapi.io/cart/${obj.id}`);
            setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)))
        } else {
            axios.post('https://60ec2df4e9647b0017cde0e0.mockapi.io/cart', obj);
            setCartItems((prev) => [...prev, obj]);
        }
    };

    const onRemoveItem = (id) => {
        axios.delete(`https://60ec2df4e9647b0017cde0e0.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = async (obj) => {
        // debugger
        try {
            if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
                axios.delete(`https://60ec2df4e9647b0017cde0e0.mockapi.io/favorites/${obj.id}`);
                setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
            } else {
                const {data} = await axios.post('https://60ec2df4e9647b0017cde0e0.mockapi.io/favorites', obj);
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалось добавить в фавориты');
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.id) === Number(id));
    };

    return (
       <AppContext.Provider value={{items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartOpened, setCartItems}}>
           <div className="wrapper clear">
                   <Drawer
                       items={cartItems}
                       onClose={() => setCartOpened(false)}
                       onRemove={onRemoveItem}
                       opened={cartOpened}
                   />

               <Header onClickCart={() => setCartOpened(true)}/>

               <Route path="/" exact>
                   <Home
                       items={items}
                       cartItems={cartItems}
                       searchValue={searchValue}
                       setSearchValue={setSearchValue}
                       onChangeSearchInput={onChangeSearchInput}
                       onAddToFavorite={onAddToFavorite}
                       onAddToCart={onAddToCart}
                       isLoading={isLoading}
                   />
               </Route>

               <Route path="/favorites" exact>
                   <Favorites/>
               </Route>

               <Route path="/orders" exact>
                   <Orders/>
               </Route>
           </div>
       </AppContext.Provider>
    );
}

export default App;
