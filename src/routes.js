import React from "react";
import { Route } from "react-router-dom";
import Sudoku from "./Sudoku/sudoku";
import SieveOfEratosthenes from "./SieveOfEratosthenes/SieveOfEratosthenes";
import PathFindingVisualizer from "./pathFindingVisualizer/PathFindingVisualizer";
import TowerOfHanoi from "./TowerOfHanoi/TowerOfHanoi";
import Test from "./pathFindingVisualizer/test";
import CreateGraph from "./CreateGraph/CreateGraph"

const BaseRouter = () => (
    <>
      <Route exact path ="/"  component={PathFindingVisualizer} />
      <Route exact path="/sudoku" component={Sudoku} />
      <Route exact path ="/sieve"  component={SieveOfEratosthenes} />
      <Route exact path ="/towerofhanoi"  component={TowerOfHanoi} />
      <Route exact path = "/graph" component={Test} />
      <Route exact path = "/create-graph" component={CreateGraph} />
    </>
  );
  
  export default BaseRouter;
  