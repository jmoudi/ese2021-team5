import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {Vote} from './vote.model';
import {User} from './user.model';



export  enum PaymentMethod {
    Invoice = 'invoice',
    PayPal = 'paypal'
}

export interface OrderAttributes {
    orderId: number;
    userId: number;

    /**
     * two variants: either 3 attributes street, town, placecode,
     * or one string address separated by a separator character
     * e.g. ;
     */
    address: string;
    productId: number[];
    status: string;
    paymentMethod: PaymentMethod | string;
}

interface j {
        paymentMethod?: string extends PaymentMethod ? string : PaymentMethod;
        paymentMethod2: keyof typeof PaymentMethod
        aa?:  PaymentMethod extends string ? PaymentMethod : string;


}

type narrowedString =  "foo" | "bar"

// type ExtendsString = true
type ExtendsString = "foo" extends string ? true : false 
let s: narrowedString = "foo"

type i = PaymentMethod
let a:i = {Invoice: 'invoice', PayPal: 'paypal'}
let j: PaymentMethod = PaymentMethod['invoice']

type o = T extends PaymentMethod[T

const k: j = {
    //paymentMethod: 'invoice',
    paymentMethod2: 'invoice'
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> {  }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    orderId: number;
    address: string;
    userId: number;
    productId: number[];
    status: string;
    paymentMethod: string;

    public static initialize(sequelize: Sequelize) {
        Order.init({
                orderId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.NUMBER,
                    allowNull: false
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                paymentMethod: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                sequelize,
                tableName: 'orders'
            });
    }

    public static createAssociations() {
        Order.belongsTo(User, {
            targetKey: 'userId',
            as: 'User',
            onDelete: 'cascade',
            foreignKey: 'userId'
        });
    }
}
