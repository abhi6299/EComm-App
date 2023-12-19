//Cart will have userID, productID, quantity of product added

export class CartModel{
    constructor(productID, userID, quantity,id){
        this._id = id;
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
    }
    static add(productID,userID,quantity){
        const id = cartItems.length+1;
        var cartItem = new CartModel(id,productID,userID,quantity);
        cartItems.push(cartItem);
        return cartItem;
    }
    //Will retrive cart item of only logged in user
    static get(userID){
        return cartItems.filter(u=> u.userID == userID);
    }

    static delete(cartID,userID){ // userID needed to make sure user is able to del its own cart item not anybody else's
        const cartIDIndex = cartItems.findIndex(c=> c.id == cartID && c.userID == userID);
        if(cartIDIndex == -1){
            return 'Item not found'
        } else {
            cartItems.splice(cartIDIndex,1);
        }
    }
}

var cartItems = [(new CartModel(1,1,2,1)),(new CartModel(2,1,1,2))];