import React, { useState, useEffect } from 'react';
import './crypto-table.scss';

import { CoincapService } from '../../../../services/coincap-service';
//import { Spinner } from '../../../common/spinner/spinner';
import Modal from '../../../common/add-coin-modal-window/addCoinModal';
import ReactPaginate from 'react-paginate';
import { RenderTableItem } from './render-crypto-table-item';
import { addWalletItem } from '../../../wallet/wallet-items/add-wallet-items';

export function CryptoTable(props) {

  const coincapService = new CoincapService();

  let [tableCoinList, setTableCoinList] = useState({});
  let [selectedCoinID, setSelectedCoinID] = useState(null);
  let [selectedCoinName, setSelectedCoinName] = useState(null);
  let [selectedCoinPrice, setSelectedCoinPrice] = useState(null);
  let [show, setShow] = useState(false);
  let [warning, setWarning] = useState(false);

  const getCoinsInfo = () => {
    coincapService
      .getCoinsPerPage()
      .then((tableCoinList) => {
        setTableCoinList(tableCoinList)
      });
  };

  useEffect(() => {
    getCoinsInfo();
    return () => {
      setTableCoinList({});
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getCoinsInfo();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getCoinInfo = (id) => {
    coincapService
      .getCoin(id)
      .then((coin) => {
        setSelectedCoinID(selectedCoinID = coin)
      });
  };

  const handlePageClick = (data) => {
    localStorage.setItem('page', data.selected + 1);
    coincapService
      .getCoinsPerPage(data.selected + 1)
      .then((table) => {
        setTableCoinList(tableCoinList = table)
      });
  };

  const showModal = (id, name, price) => {
    getCoinInfo(id);
    setShow(show = true);
    setSelectedCoinName(selectedCoinName = name);
    setSelectedCoinPrice(selectedCoinPrice = price);
  };

  const handleClose = () => {
    setShow(show = false);
    setWarning(warning = false);
  };

  const submitModal = () => {
    if (localStorage.getItem('submit') == 0) {
      alert('Please enter a bigger amount');
      setWarning(warning = true);
    }
    else if (localStorage.getItem('submit') > 1000) {
      alert('You can buy only 999 coins per time');
      setWarning(warning = true);
    }
    else {
      setShow(show = false);
      setWarning(warning = false);
      addWalletItem(selectedCoinID);
    }
  };

  return (
    <>
      <ReactPaginate
        nextLabel=""
        onPageChange={handlePageClick}
        pageCount={5}
        previousLabel=""
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageClassName='page-item'
        pageLinkClassName='page-link'
        activeClassName='active'>
      </ReactPaginate>

      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Price</th>
              <th>Marcet Cap</th>
              <th>VWAP (24Hr)</th>
              <th>Supply</th>
              <th>Volume (24Hr)</th>
              <th>Change (24Hr)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <RenderTableItem
              tableCoinList={tableCoinList}
              showModal={showModal}
              onItemSelected={props.onItemSelected}>
            </RenderTableItem>
          </tbody>
        </table>
      </div>
      <Modal show={show} warning={warning} handleClose={handleClose} handleSubmit={submitModal}>{[selectedCoinName, selectedCoinPrice]}</Modal>
    </>
  );

};
/*
export class CryptoTable extends Component {

  coincapService = new CoincapService();

  state = {
    tableCoinList: null,
    selectedCoinId: null,
    selectedCoin: null,
    selectedCoinPrice: null,
    show: false,
    warning: false
  };


  componentDidMount() {
    this.updateData();
    this.interval = setInterval(() => this.setState(this.updateData), 10000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };

  updateData = () => {
    this.coincapService
      .getCoinsPerPage()
      .then((tableCoinList) => {
        this.setState({
          tableCoinList
        });
      })
  };

  handlePageClick = (data) => {
    localStorage.setItem('page', data.selected + 1);
    this.coincapService
      .getCoinsPerPage(data.selected + 1)
      .then((tableCoinList) => {
        this.setState({
          tableCoinList
        });
      })
  };

  renderItems(arr) {
    return arr.map(({ id, rank, name, priceUsd, marketCapUsd, vwap24Hr, supply, volumeUsd24Hr, changePercent24Hr }) => {
      return (
        <tr key={id} onClick={() => this.props.onItemSelected(id)}>
          <td>
            <Link to="/details">{rank}</Link>
          </td>
          <td>
            <Link to="/details">{name}</Link>
          </td>
          <td>
            <Link to="/details">{`${parseFloat(priceUsd).toFixed(3)}$`}</Link>
          </td>
          <td>
            <Link to="/details"> {`${parseFloat(marketCapUsd / 1000000000).toFixed(2)}$ b.`}</Link>
          </td>
          <td>
            <Link to="/details">{`${parseFloat(vwap24Hr).toFixed(2)}$`}</Link>
          </td>
          <td>
            <Link to="/details">  {`${parseFloat(supply / 1000000).toFixed(2)}m.`}</Link>
          </td>
          <td>
            <Link to="/details">  {`${parseFloat(volumeUsd24Hr / 1000000).toFixed(2)}m.`}</Link>
          </td>
          <td>
            <Link to="/details"> {`${parseFloat(changePercent24Hr).toFixed(2)}%`}</Link>
          </td>
          <td className="crypto-add" onClick={() => this.showModal(id, name, priceUsd)}>
            <i className="fa-solid fa-plus"></i>
          </td>
        </tr>
      );
    });
  };

  showModal = (id, name, price) => {
    this.setState({
      show: true,
      selectedCoinId: id,
      selectedCoin: name,
      selectedCoinPrice: price
    });
  };

  hideModal = () => {
    this.setState({ show: false });
    this.setState({ warning: false });
  };

  submitModal = () => {
    if (localStorage.getItem('submit') == 0) {
      alert('Please enter a bigger amount');
      this.setState({ warning: true });
    }
    else if (localStorage.getItem('submit') > 1000) {
      alert('You can buy only 999 coins per time');
      this.setState({ warning: true });
    }
    else {
      this.setState({ show: false });
      this.setState({ warning: false });
      this.addWalletItem();
    }
  };

  addWalletItem() {
    const state = this.state;
    let existingEntries = JSON.parse(localStorage.getItem("walletData"));
    if (existingEntries == null) existingEntries = [];

    const newItem = {
      id: state.selectedCoinId,
      name: state.selectedCoin,
      price: state.selectedCoinPrice,
      amount: localStorage.getItem('submit'),
    }
    localStorage.setItem('wallet', JSON.stringify(newItem));
    existingEntries.push(newItem);
    localStorage.setItem("walletData", JSON.stringify(existingEntries));
  };

  render() {
    const { tableCoinList, selectedCoin, selectedCoinPrice } = this.state;

    if (!tableCoinList) {
      return <Spinner />;
    };

    const items = this.renderItems(tableCoinList)

    return (
      <>
        <ReactPaginate
          nextLabel=""
          onPageChange={this.handlePageClick}
          pageCount={5}
          previousLabel=""
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName='page-item'
          pageLinkClassName='page-link'
          activeClassName='active'>
        </ReactPaginate>
        <div className="container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Price</th>
                <th>Marcet Cap</th>
                <th>VWAP (24Hr)</th>
                <th>Supply</th>
                <th>Volume (24Hr)</th>
                <th>Change (24Hr)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <RenderItem tableCoinList={tableCoinList} />
            </tbody>
          </table>
        </div>
        <Modal show={this.state.show} warning={this.state.warning} handleClose={this.hideModal} handleSubmit={this.submitModal}>{[selectedCoin, selectedCoinPrice]}</Modal>
      </>
    );
  };
}; 
*/