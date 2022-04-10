import React, { useEffect, useState } from 'react';
import './header.scss';

import { CoincapService } from '../../../services/coincap-service';
import { Wallet } from '../../wallet/wallet-modal-window/wallet-modal-window';
import { HeaderTopCoins } from './header-top-coins/header-top-coins';
import { getCurrentCost } from './header-prices/header-prices';
import { HeaderWallet } from './header-wallet/header-wallet';
import { RenderHeaderLogo } from './header-logo/header-logo';

export function Header() {

  const coincapService = new CoincapService();

  let [headerCoinList, setHeaderCoinList] = useState({});
  let [headerCoinCost, setHeaderCoinCost] = useState({});
  let [show, setShow] = useState(false);

  const setCoins = () => {
    coincapService
      .getAllCoins()
      .then((headerCoinList) => {
        setHeaderCoinList(headerCoinList)
      });
  };

  const setCurrentCost = () => {
    getCurrentCost()
      .then((headerCoinCost) => {
        setHeaderCoinCost(headerCoinCost)
      });
  }

  useEffect(() => {
    setCoins();
    setCurrentCost();
    return () => {
      setHeaderCoinList({});
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins();
      setCurrentCost();
    }, 10000);
    return () => {
      setHeaderCoinList({});
      setHeaderCoinCost({});
      clearInterval(interval);
    };
  }, []);

  const showModal = () => {
    setShow(show = true);
  };

  const hideModal = () => {
    setShow(show = false);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="container__inner">
            <RenderHeaderLogo />
            <div className="top-coins">
              <HeaderTopCoins headerCoinList={headerCoinList} />
            </div>
            <HeaderWallet showModal={showModal} headerCoinCost={headerCoinCost} />
          </div>
        </div>
      </header>
      <Wallet show={show} handleClose={hideModal} />
    </>
  );
};

/*
export class Header extends Component {

  coincapService = new CoincapService();

  state = {
    headerCoinList: null,
    headerCoinCost: [],
    show: false,
  };


  componentDidMount() {
    this.updateData();
    this.getCurrentCost()
      .then((headerCoinCost) => {
        this.setState({
          headerCoinCost
        });
      });
    this.interval = setInterval(this.updateData, 5000);
    this.interval1 = setInterval(this.updateCostData, 5000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };

  updateData = () => {
    this.coincapService
      .getAllCoins()
      .then((headerCoinList) => {
        this.setState({
          headerCoinList
        });
      })
  }

  updateCostData = () => {
    this.getCurrentCost().
      then((headerCoinCost) => {
        this.setState({
          headerCoinCost
        });
      });
  }

  renderItems(arr) {
    return arr.slice(0, 3).map(({ id, name, priceUsd }) => {
      return (
        <div className="top-coins__item" key={id}>
          <div className="top-coins__item-name">{name}</div>
          <div className="top-coins__item-price">{`${parseFloat(priceUsd).toFixed(3)}$`}</div>
        </div>
      );
    });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  getLocaleCost() {
    let localCostArr = [];
    let sum = 0;

    let existingEntries = JSON.parse(localStorage.getItem("walletData"));
    if (existingEntries == null) existingEntries = [];

    existingEntries.map(el => {
      localCostArr.push(el.price * el.amount)
    });

    for (let i = 0; i < localCostArr.length; i++) {
      sum += +localCostArr[i];
    }

    return sum;
  }

  async getCurrentCost() {
    let currentCostArr = [];
    let sum = 0;

    let existingEntries = JSON.parse(localStorage.getItem("walletData"));
    if (existingEntries == null) existingEntries = [];

    await Promise.all(existingEntries.map(async (el) => {
      const coin = await this.coincapService.getCoin(el.id)
      currentCostArr.push(+coin.priceUsd * +el.amount)
    }))

    for await (const variable of currentCostArr) {
      sum += variable;
    }

    return sum;
  }


  render() {
    const { headerCoinList, headerCoinCost } = this.state;

    if (!headerCoinList) {
      return <Spinner />;
    }

    const items = this.renderItems(headerCoinList);
    let currentCost = headerCoinCost;
    const localeCost = this.getLocaleCost();
    const difference = parseFloat(currentCost - localeCost).toFixed(2);
    const diff = difference > 0 ? '+' + (difference) : (difference);
    let percent = parseFloat(((diff) * 100) / currentCost).toFixed(2);
    let totalPercent = (percent < 0 ? + percent : "" + percent);



    return (
      <>
        <header className="header">
          <div className="container">
            <div className="container__inner">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="Coincap"></img>
                </Link>
              </div>
              <div className="top-coins">
                {items}
              </div>

              <div className="user-wallet-info" onClick={this.showModal}>
                <div className="user-wallet__current-cost">{parseFloat(currentCost).toFixed(2)} $</div>
                <div className="user-wallet__different-cost">{`${diff == NaN ? 0 : diff}`}</div>
                <div className="user-wallet__different-cost-percent">{(isNaN(percent) || percent == Infinity) ? 0 : totalPercent}%</div>
                <i className="fa-solid fa-briefcase"></i>
              </div>

            </div>
          </div>
        </header>
        <Wallet show={this.state.show} handleClose={this.hideModal} />
      </>
    )
  }
}
*/