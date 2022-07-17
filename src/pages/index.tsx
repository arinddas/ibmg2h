// src/pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from "next/link"
import { VStack, Heading, Box, LinkOverlay, LinkBox, useColorModeValue} from "@chakra-ui/layout"
import { Text, Button } from '@chakra-ui/react'
import { useState, useEffect} from 'react'
import {ethers} from "ethers"
import ReadERC20 from "components/ReadERC20"
import TransferERC20 from "components/TransferERC20"
import BurnERC20 from "components/BurnERC20"

declare let window:any
const addressERC20 = '0x29d79F8ac7D22A4b1a5E7630F3d48E8d291D3f11'

const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [chainname, setChainName] = useState<string | undefined>()

  useEffect(() => {
    //get ETH balance and network info only when having currentAccount 
    if(!currentAccount || !ethers.utils.isAddress(currentAccount)) return

    //client side code
    if(!window.ethereum) {
      console.log("please install MetaMask")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result)=>{
      setBalance(ethers.utils.formatEther(result))
    }).catch((e)=>console.log(e))

    provider.getNetwork().then((result)=>{
      setChainId(result.chainId)
      setChainName(result.name)
    }).catch((e)=>console.log(e))

  },[currentAccount])

  //click connect
  const onClickConnect = () => {
    //client side code
    if(!window.ethereum) {
      console.log("please install MetaMask")
      return
    }
    /*
    //change from window.ethereum.enable() which is deprecated
    //call window.ethereum.request() directly
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then((accounts:any)=>{
      if(accounts.length>0) setCurrentAccount(accounts[0])
    })
    .catch('error',console.error)
    */

    //we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.send("eth_requestAccounts", [])
    .then((accounts)=>{
      if(accounts.length>0) setCurrentAccount(accounts[0])
    }).catch((e)=>console.log(e))

  }

  //click disconnect
  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  return (
    <>
      <Head>
        <title>H2 GREEN Token DAPP</title>
      </Head>

      <Heading as="h3"  my={4}>Explore Green Hydrogen Tokenization</Heading>          
      <VStack>
        <Box w='100%' my={4}>
        {currentAccount  
          ? <Button type="button" w='100%' onClick={onClickDisconnect}>
                Account:{currentAccount}
            </Button>
          : <Button type="button" w='100%' onClick={onClickConnect}>
                  Connect Web3 wallet | MetaMask
              </Button>
        }
        </Box>
        {currentAccount  
          ?<Box  mb={0} p={4} w='100%' borderWidth="3px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Account info</Heading>
          <Text>Matic Balance of current account: {balance}</Text>
          <Text>Chain Info: ChainId {chainId} name {chainname}</Text>
        </Box>
        :<></>
        }

        <Box  mb={0} p={4} w='100%' borderWidth="3px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Read H2G Token Info</Heading>
          <ReadERC20 
            addressContract={addressERC20}
            currentAccount={currentAccount}
          />
        </Box>

        <Box  mb={0} p={4} w='100%' borderWidth="3px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Transfer H2G Token</Heading>
          <TransferERC20 
            addressContract={addressERC20}
            currentAccount={currentAccount}
          />
        </Box>

        <Box  mb={0} p={4} w='100%' borderWidth="3px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Burn H2G Token</Heading>
          <BurnERC20 
            addressContract={addressERC20}
            currentAccount={currentAccount}
          />
        </Box>

      </VStack>
    </>
  )
}

export default Home