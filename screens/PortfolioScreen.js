//Import libraries for the alpaca API
import * as React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import alpacaApi from '../services/alpaca';
import { Text, View } from '../components/Themed';
import coinGeckoApi from '../services/coingecko';

//Class for the screen
class PortfolioScreen extends React.Component {

  //Create the title
  static navigationOptions = {
    title: 'Dashboard'
  }

  //Create a constructor for the data
  constructor(props) {
    super(props)

    this.state = {
      buying_power: 0,
      cash: 0,
      long_market_value: 0,
      portfolio_value: 0,

      positions: [],
      pic: '',
    }

  }

  //Get the data from the API
  componentDidMount() {

    //Declare the api used
    const coinapi = coinGeckoApi()
    const api = alpacaApi()

    //Use the account to get account data
    api.getAccount().then((response) => {

        //console.log(response)

        //Check the response
        if (response.ok) {
            //Set the state of the account
            this.setState({
              buying_power: parseFloat(response.data.non_marginable_buying_power).toFixed(2),
              long_market_value: parseFloat(response.data.long_market_value).toFixed(2),
              portfolio_value: parseFloat(response.data.portfolio_value).toFixed(2),
              cash: parseFloat(response.data.cash).toFixed(2),

            })
        }
    })
    
    // Get our positions
    api.getPositions().then((pos_response) => {

        // console.log(pos_response.data)

        //Get the position data
        if (pos_response.ok) {
          this.setState({
            positions: pos_response.data
          })
        }

    })
    // console.log(this.state)
    // this.state.positions.forEach(element => {
    //   console.log(element.symbol)
    // });

    const string_name = 'bitcoin'

    coinapi.getCoinData(string_name).then((coinData) => {
      if (coinData) {
        // console.log(coinData.image.large)
        this.setState({
          pic: coinData.image.large,
        })

        // console.log(this.state.positions)
        // temp_str = "https://api.coingecko.com/api/v3/coins/"
        // console.log(temp_str+'bitcoin')
      }

    })

    
  }

  //Function to render a row for positions
  renderRow = ({item}) => {
    //Get color of the profit gain or loss
    const profit_color = ((item.change_today * 100) > 0) ? 'green' : 'red';

    const coinapi = coinGeckoApi()

    console.log(item.symbol)

    coin_name = ""

    //Alpaca currently only has 4 different types of crypto available for trading
    //ETH, BTC, BCH, and LTC
    switch(item.symbol) {
      case "ETHUSD":
        console.log("ethereum")

      case "BTCUSD":
        console.log("bitcoin")
        
      case "BCHUSD":
        console.log("bitcoincash")

      case "LTCUSD":
        console.log("litecoin")

      default:
        console.log("error")
    }

    const string_name = 'bitcoin'

    coinapi.getCoinData(string_name).then((coinData) => {
      if (coinData) {
        console.log(coinData.image.large)
        // this.setState({
        //   pic: coinData.image.large,
        // })

        // console.log(this.state.positions)
        // temp_str = "https://api.coingecko.com/api/v3/coins/"
        // console.log(temp_str+'bitcoin')
      }

    })

    return (
      <View key={item.asset_id} style={styles.positions}>
        <View style={{ flex: 1 }}>
          <Text style={styles.symbol}>{item.symbol}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{item.qty}</Text>
          <Text style={styles.subheading}>${(item.avg_entry_price * 1).toFixed(2)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.price, { color: profit_color }]}>${(item.current_price * item.qty).toFixed(2)}</Text>
          <Text style={styles.subheading}>{(item.change_today * 100).toFixed(3)}</Text>
        </View>
      </View>
    )
  }

  //Output data
  render() {
    return <View style={{ flex: 1, flexDirection: 'column' }}>

      <View style={{ flex: .45, padding: 5, flexDirection: 'row', backgroundColor: '#F2F2F2' }}>
        
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#F2F2F2' }}>
          <Text style={styles.container}>Buying Power</Text>
          <Text style={styles.cash}>${this.state.buying_power}</Text>
          <Text style={styles.container}>Cash</Text>
          <Text style={styles.cash}>${this.state.cash}</Text>
        </View>

        <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#F2F2F2' }}>
          <Text style={styles.container}>Long Market Value</Text>
          <Text style={styles.cash}>${this.state.long_market_value}</Text>
          <Text style={styles.container}>Portfolio Value</Text>
          <Text style={styles.cash}>${this.state.portfolio_value}</Text>
        </View>
      </View>

      <View style={{ flex: 2.5, padding: 5, backgroundColor: '#F2F2F2' }}>
      
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
            <Text style={styles.container}>Symbol:</Text>
          </View>
          
          <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
            <Text style={styles.container}>Shares:</Text>
            <Text style={styles.subheading}>Price Bought @:</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
            <Text style={styles.container}>Market Value:</Text>
            <Text style={styles.subheading}>Value Change:</Text>
          </View>
        </View>

        <View style={{ flex: 10, flexDirection: 'row', backgroundColor: '#F2F2F2' }}>
          <FlatList
            data = {this.state.positions}
            renderItem = {this.renderRow}
            keyExtractor = {item => item.asset_id}
          />

        </View>

        <View style={{ flex: 10, flexDirection: 'row', backgroundColor: '#F2F2F2' }}>

          <Image source={this.state.pic ? {uri: this.state.pic } : null} style={styles.image} />
        </View>
      </View>

    </View>

  }
}

export default PortfolioScreen

const styles = StyleSheet.create({
  container: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 5,
  },
  cash: {
    color: 'green',
  },
  positions: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subheading: {
    color: '#808080',
  },
  image: {
    height: 48,
    width: 48,
  },
});
