import React, { Component } from 'react'
import './hanoi.css'

export class TowerOfHanoi extends Component {

    componentDidMount() {
        this.towerOfHanoi(6)
    }

    async towerOfHanoi(number){
        const a = [];
        const b = [];
        const c = [];
        let iterator = number;
        const tower1 = document.getElementsByClassName('tower1')[0];
      //fill first tower with disks equal to number imput
        for(iterator; iterator > 0; iterator--){
          a.push(iterator);
        }
  
      // create the disks
        a.forEach((item) => {
          let element = document.createElement("div");
          element.className = "disk";
          element.setAttribute("id", item);
          const style = {
              width: 200 / (number+1)*item + "px",
              bottom: a.indexOf(item)*20 + "px",
              background: "rgb(" 
                  + Math.floor(Math.random() * 256) + "," 
                  + Math.floor(Math.random() * 256) + "," 
                  + Math.floor(Math.random() * 256) + ")",
              transform: "translateX(0px)"
          }
          Object.assign(element.style, style);
          tower1.appendChild(element);
        });
  
      // this moves the disks
        if(number%2 != 0){
          while(c.length < number){
            await this.moveDisk(a, c, c, number, 2);
            await this.moveDisk(a, b, c, number, 1);
            await this.moveDisk(b, c, c, number, 1)
          }
        }else {
          while(c.length < number){
            await this.moveDisk(a, b, c, number, 1);
            await this.moveDisk(a, c, c, number, 2);
            await this.moveDisk(b, c, c, number, 1);
          }
        }
      };
  
  
  
      // move disk function, parameters are start, destination, finsh peg and distance between start and destination
      async moveDisk(a, b, c, number, distance) {
          if (c.length == number) return;
  
          if(!a.length && b.length){
            await this.draw(b, a, distance*-1);
            a.push(b[b.length-1]);
            b.pop();
          } else if (!b.length && a.length) {
            await this.draw(a, b, distance);
            b.push(a[a.length-1]);
            a.pop();
  
          } else {
            if(a[a.length-1] < b[b.length-1]){
              while(a[a.length-1] < b[b.length-1]){
                await this.draw(a, b, distance);
                b.push(a[a.length-1]);
                a.pop();
              }
  
            } else if(b[b.length-1] < a[a.length-1]){
              while(b[b.length-1] < a[a.length-1]){
                await this.draw(b, a, distance*-1);
                a.push(b[b.length-1]);
                b.pop();
              }
            }
          }
      };
  
      //moving function: this should animate the disks
      async draw(a, b, distance){
        let num = a[a.length-1].toString();
        let disk = document.getElementById(num);
  
      //get current translateX css value and then add the distance between start and destination peg
        let regEx = /\.*translateX\((.*)px\)/i;
        let translate = disk.getAttribute('style')
        let value = parseInt(regEx.exec(translate)[1]) + (distance*400);
  
          //move disk up 
          
          setTimeout(() => {
            disk.style.bottom = "385px";
          },250)
          //move disk to the destination peg
         
          setTimeout(() => {
            disk.style.transform = "translateX(" + value +"px)";
          },250)
          //drop disk
          
          setTimeout(() => {
            disk.style.bottom = b.length * 20 +"px";
          },250)
      };


    render() {
        return (
            <div>
                <centre>
                    
                    <div class="towerOfHanoi">
                        <div class="tower1">
                            <div class="stick"></div>
                        </div>
                        <div class="tower2">
                            <div class="stick"></div>
                        </div>
                        <div class="tower3">
                            <div class="stick"></div>
                        </div>
                    </div>
                </centre>
            </div>
        )
    }
}

export default TowerOfHanoi
