import React, { useState, useEffect } from 'react';
import './App.scss';
import { isEmpty } from 'lodash';
import Preloader from './utils/preloader.util';
import attackPreloader from './assets/lottie/fight.json'; // Path to your Lottie animation JSON file

function App () {
    const [playerHealth, setPlayerHealth] = useState( 100 );
    const [playerMana, setPlayerMana] = useState( 100 );
    const [enemyHealth, setEnemyHealth] = useState( 100 );
    const [enemyMana, setEnemyMana] = useState( 100 );
    const [playerMaxHealth] = useState( 100 );
    const [playerMaxMana] = useState( 100 );
    const [enemyMaxHealth, setEnemyMaxHealth] = useState( 100 );
    const [enemyMaxMana, setEnemyMaxMana] = useState( 100 );
    const [playerCriticalChance, setPlayerCriticalChance] = useState( 0.2 );
    const [enemyCriticalChance, setEnemyCriticalChance] = useState( 0.2 );
    const [battleLog, setBattleLog] = useState( [] );
    const [currentView, setCurrentView] = useState( 'battle' ); // battle | store | cave
    const [playerGold, setPlayerGold] = useState( 100 );
    const [playerWeaponBonus, setPlayerWeaponBonus] = useState( 0 );
    const [enemyName, setEnemyName] = useState( 'Dragon' );
    const [showAttackAnimation, setShowAttackAnimation] = useState( null );
    
    const getRandomInt = ( min, max ) => Math.floor( Math.random() * ( max - min + 1 ) ) + min;

    const addBattleLog = ( message ) => {
        setBattleLog( prevLog => [message, ...prevLog] );
    };
    
    const hidePreloader = () => {
        setTimeout(() => {
            setShowAttackAnimation(null);
        }, 700 );
    }
    const showPreloader = ({animationData={}}) => {
        setShowAttackAnimation({ animationData: animationData });
    }
    const initBattle = ( type = 'battle' ) => {
        if ( type === 'battle' ) {
            setEnemyHealth( 100 );
            setEnemyMana( 100 );
            setEnemyMaxHealth( 100 );
            setEnemyMaxMana( 100 );
            setEnemyCriticalChance( 0.2 );
            setEnemyName( 'Dragon' );
        } else if ( type === 'cave' ) {
            setEnemyHealth( 150 );
            setEnemyMana( 120 );
            setEnemyMaxHealth( 150 );
            setEnemyMaxMana( 120 );
            setEnemyCriticalChance( 0.3 );
            setEnemyName( 'Cave Troll' );
        }
    };

    const playerAttack = () => {
        showPreloader( {animationData: attackPreloader} );
        const isCritical = Math.random() < playerCriticalChance;
        const baseDamage = getRandomInt( 10, 20 ) + playerWeaponBonus;
        const damage = baseDamage * ( isCritical ? 2 : 1 );
        hidePreloader();
        setEnemyHealth( prev => Math.max( prev - damage, 0 ) );
        setPlayerGold( prev => Math.max( prev + getRandomInt( 10, 20 ) + playerWeaponBonus, 0 ) );
        addBattleLog( `Player ${isCritical ? 'critically ' : ''}attacks ${enemyName} for ${damage} damage!` );
        enemyTurn();
    };

    const playerCastSpell = () => {
        const manaCost = 20;
        if ( playerMana >= manaCost ) {
            const isCritical = Math.random() < playerCriticalChance;
            const baseDamage = getRandomInt( 20, 30 ) + playerWeaponBonus;
            const damage = baseDamage * ( isCritical ? 2 : 1 );
            setEnemyHealth( prev => Math.max( prev - damage, 0 ) );
            setPlayerMana( prev => prev - manaCost );
            setPlayerGold( prev => Math.max( prev + getRandomInt( 10, 20 ) + playerWeaponBonus, 0 ) );
            addBattleLog( `Player casts spell and ${isCritical ? 'critically ' : ''}deals ${damage} damage to ${enemyName}!` );
            enemyTurn();
        } else {
            addBattleLog( 'Not enough mana to cast spell!' );
        }
    };

    const enemyTurn = () => {
        setTimeout( () => {
            if ( enemyHealth === 0 ) {
                if ( currentView === 'cave' ) {
                    setPlayerGold( prev => prev + 100 ); // Bigger reward in cave
                    addBattleLog( 'You defeated the Cave Troll and earned 100 gold!' );
                } else {
                    setPlayerGold( prev => prev + 50 );
                    addBattleLog( 'You defeated the enemy and earned 50 gold!' );
                }
                return;
            }

            const enemyAction = Math.random() < 0.5 ? 'attack' : 'castSpell';
            if ( enemyAction === 'attack' ) {
                const isCritical = Math.random() < enemyCriticalChance;
                const damage = getRandomInt( 10, 25 );
                setPlayerHealth( prev => Math.max( prev - damage, 0 ) );
                addBattleLog( `${enemyName} ${isCritical ? 'critically ' : ''}attacks Player for ${damage} damage!` );
            } else if ( enemyMana >= 20 ) {
                const isCritical = Math.random() < enemyCriticalChance;
                const damage = getRandomInt( 20, 35 );
                setPlayerHealth( prev => Math.max( prev - damage, 0 ) );
                setEnemyMana( prev => prev - 20 );
                addBattleLog( `${enemyName} casts spell and ${isCritical ? 'critically ' : ''}deals ${damage} damage to Player!` );
            } else {
                const damage = getRandomInt( 10, 25 );
                setPlayerHealth( prev => Math.max( prev - damage, 0 ) );
                addBattleLog( `${enemyName} attacks Player for ${damage} damage!` );
            }
        }, 500 );
    };

    const restartGame = () => {
        setPlayerHealth( playerMaxHealth );
        setPlayerMana( playerMaxMana );
        setPlayerGold( 100 );
        setPlayerWeaponBonus( 0 );
        setCurrentView( 'battle' );
        initBattle( 'battle' );
        setBattleLog( ['Game restarted!'] );
    };

    const buyHealthPotion = () => {
        if ( playerGold >= 30 ) {
            setPlayerGold( prev => prev - 30 );
            setPlayerHealth( prev => Math.min( prev + 30, playerMaxHealth ) );
            addBattleLog( 'Player buys Health Potion and heals 30 HP!' );
        } else {
            addBattleLog( 'Not enough gold to buy Health Potion!' );
        }
    };

    const buyManaPotion = () => {
        if ( playerGold >= 20 ) {
            setPlayerGold( prev => prev - 20 );
            setPlayerMana( prev => Math.min( prev + 30, playerMaxMana ) );
            addBattleLog( 'Player buys Mana Potion and restores 30 Mana!' );
        } else {
            addBattleLog( 'Not enough gold to buy Mana Potion!' );
        }
    };

    const buyWeaponUpgrade = () => {
        if ( playerGold >= 50 ) {
            setPlayerGold( prev => prev - 50 );
            setPlayerWeaponBonus( prev => prev + 5 );
            addBattleLog( 'Player buys Weapon Upgrade! +5 attack bonus.' );
        } else {
            addBattleLog( 'Not enough gold to buy Weapon Upgrade!' );
        }
    };

    const goToView = ( view ) => {
        setCurrentView( view );
        if ( view === 'battle' ) initBattle( 'battle' );
        if ( view === 'cave' ) {
            initBattle( 'cave' );
            addBattleLog( 'You enter the dark cave and encounter a Cave Troll!' );
        }
    };

    useEffect( () => {
        if ( playerHealth === 0 ) {
            addBattleLog( 'You have been defeated!' );
        }
    }, [playerHealth] );

    return (
        <div className="App">
            {!isEmpty(showAttackAnimation) && <Preloader animationData={showAttackAnimation.animationData} />}
            <div className="game-header">
                <div className='game-header_title'>RPG Battle</div>
                <div className='game-header_subTitle'>Gold: {playerGold}</div>

            </div>

            {currentView === 'battle' && (
                <>
                    <div className="battlefield">
                        <div className="player">
                            <h2>Player</h2>
                            <p>Health: {playerHealth} / {playerMaxHealth}</p>
                            <p>Mana: {playerMana} / {playerMaxMana}</p>
                            <p>Weapon Bonus: +{playerWeaponBonus}</p>
                            <button className="attack-button" onClick={playerAttack} disabled={playerHealth === 0 || enemyHealth === 0}>Attack</button>
                            <button className="spell-button" onClick={playerCastSpell} disabled={playerMana < 20 || playerHealth === 0 || enemyHealth === 0}>Cast Spell (20 Mana)</button>
                        </div>
                        <div className="enemy">
                            <h2>{enemyName}</h2>
                            <p>Health: {enemyHealth} / {enemyMaxHealth}</p>
                            <p>Mana: {enemyMana} / {enemyMaxMana}</p>
                        </div>
                    </div>
                    <button onClick={() => goToView( 'store' )}>Go to Store </button>
                    <button onClick={() => goToView( 'cave' )}>Go to Cave </button>
                    <button onClick={restartGame}>Restart Game</button>
                </>
            )}

            {currentView === 'store' && (
                <div className="store">
                    <h2>Store </h2>
                    <button onClick={buyHealthPotion}>Buy Health Potion (30 Gold)</button>
                    <button onClick={buyManaPotion}>Buy Mana Potion (20 Gold)</button>
                    <button onClick={buyWeaponUpgrade}>Buy Weapon Upgrade (50 Gold)</button>
                    <br />
                    <button onClick={() => goToView( 'battle' )}>Back to Battlefield </button>
                    <button onClick={() => goToView( 'cave' )}>Go to Cave </button>
                </div>
            )}

            {currentView === 'cave' && (
                <div className="cave">
                    <h2>Dark Cave </h2>
                    <div className="battlefield">
                        <div className="player">
                            <h2>Player</h2>
                            <p>Health: {playerHealth} / {playerMaxHealth}</p>
                            <p>Mana: {playerMana} / {playerMaxMana}</p>
                            <p>Weapon Bonus: +{playerWeaponBonus}</p>
                            <button onClick={playerAttack} disabled={playerHealth === 0 || enemyHealth === 0}>Attack</button>
                            <button onClick={playerCastSpell} disabled={playerMana < 20 || playerHealth === 0 || enemyHealth === 0}>Cast Spell (20 Mana)</button>
                        </div>
                        <div className="enemy">
                            <h2>{enemyName}</h2>
                            <p>Health: {enemyHealth} / {enemyMaxHealth}</p>
                            <p>Mana: {enemyMana} / {enemyMaxMana}</p>
                        </div>
                    </div>
                    <button onClick={() => goToView( 'store' )}>Go to Store </button>
                    <button onClick={() => goToView( 'battle' )}>Back to Battlefield </button>
                </div>
            )}

            <div className="battle-log">
                <div className='battle-log_header'>Battle Log</div>
                <ul>
                    {battleLog.map( ( log, index ) => (
                        <li key={index}>{log}</li>
                    ) )}
                </ul>
            </div>
        </div>
    );
}

export default App;
