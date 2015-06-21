var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var network = require('../network');
var trainer = require('../trainer');
var Layer = require('../layer');
var LSTM = (function (_super) {
    __extends(LSTM, _super);
    function LSTM() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length < 3)
            throw "Error: not enough layers (minimum 3) !!";
        var last = args.pop();
        var option = {
            peepholes: Layer.Layer.connectionType.ALL_TO_ALL,
            hiddentohidden: false,
            outtohidden: false,
            outtogates: false,
            intoout: true,
        };
        if (typeof last != 'number') {
            var outputs = args.pop();
            if (last.hasOwnProperty('peepholes'))
                option.peepholes = last.peepholes;
            if (last.hasOwnProperty('hiddentohidden'))
                option.hiddentohidden = last.hiddentohidden;
            if (last.hasOwnProperty('outtohidden'))
                option.outtohidden = last.outtohidden;
            if (last.hasOwnProperty('outtogates'))
                option.outtogates = last.outtogates;
            if (last.hasOwnProperty('intoout'))
                option.intoout = last.intoout;
        }
        else
            var outputs = last;
        var inputs = args.shift();
        var layers = args;
        var inputLayer = new Layer.Layer(inputs);
        var hiddenLayers = [];
        var outputLayer = new Layer.Layer(outputs);
        var previous = null;
        for (var layer in layers) {
            // generate memory blocks (memory cell and respective gates)
            var size = layers[layer];
            var inputGate = new Layer.Layer(size).set({
                bias: 1
            });
            var forgetGate = new Layer.Layer(size).set({
                bias: 1
            });
            var memoryCell = new Layer.Layer(size);
            var outputGate = new Layer.Layer(size).set({
                bias: 1
            });
            hiddenLayers.push(inputGate);
            hiddenLayers.push(forgetGate);
            hiddenLayers.push(memoryCell);
            hiddenLayers.push(outputGate);
            // connections from input layer
            var input = inputLayer.project(memoryCell);
            inputLayer.project(inputGate);
            inputLayer.project(forgetGate);
            inputLayer.project(outputGate);
            // connections from previous memory-block layer to this one
            if (previous != null) {
                var cell = previous.project(memoryCell);
                previous.project(inputGate);
                previous.project(forgetGate);
                previous.project(outputGate);
            }
            // connections from memory cell
            var output = memoryCell.project(outputLayer);
            // self-connection
            var self = memoryCell.project(memoryCell);
            // hidden to hidden recurrent connection
            if (option.hiddentohidden)
                memoryCell.project(memoryCell, Layer.Layer.connectionType.ALL_TO_ELSE);
            // out to hidden recurrent connection
            if (option.outtohidden)
                outputLayer.project(memoryCell);
            // out to gates recurrent connection
            if (option.outtogates) {
                outputLayer.project(inputGate);
                outputLayer.project(outputGate);
                outputLayer.project(forgetGate);
            }
            // peepholes
            memoryCell.project(inputGate, option.peepholes);
            memoryCell.project(forgetGate, option.peepholes);
            memoryCell.project(outputGate, option.peepholes);
            // gates
            inputGate.gate(input, Layer.Layer.gateType.INPUT);
            forgetGate.gate(self, Layer.Layer.gateType.ONE_TO_ONE);
            outputGate.gate(output, Layer.Layer.gateType.OUTPUT);
            if (previous != null)
                inputGate.gate(cell, Layer.Layer.gateType.INPUT);
            previous = memoryCell;
        }
        // input to output direct connection
        if (option.intoout)
            inputLayer.project(outputLayer);
        // set the layers of the neural network
        _super.call(this, {
            input: inputLayer,
            hidden: hiddenLayers,
            output: outputLayer
        });
        // trainer
        this.trainer = new trainer.Trainer(this);
    }
    return LSTM;
})(network.Network);
exports.LSTM = LSTM;
;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcmNoaXRlY3QvTFNUTS50cyJdLCJuYW1lcyI6WyJMU1RNIiwiTFNUTS5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxPQUFPLFdBQVksWUFBWSxDQUFDLENBQUM7QUFDeEMsSUFBTyxPQUFPLFdBQVksWUFBWSxDQUFDLENBQUM7QUFDeEMsSUFBTyxLQUFLLFdBQVksVUFBVSxDQUFDLENBQUM7QUFHcEMsSUFBYSxJQUFJO0lBQVNBLFVBQWJBLElBQUlBLFVBQXdCQTtJQUd2Q0EsU0FIV0EsSUFBSUE7UUFHSEMsY0FBY0E7YUFBZEEsV0FBY0EsQ0FBZEEsc0JBQWNBLENBQWRBLElBQWNBO1lBQWRBLDZCQUFjQTs7UUFFeEJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO1lBQ2xCQSxNQUFNQSx5Q0FBeUNBLENBQUNBO1FBRWxEQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUN0QkEsSUFBSUEsTUFBTUEsR0FBR0E7WUFDWEEsU0FBU0EsRUFBRUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsVUFBVUE7WUFDaERBLGNBQWNBLEVBQUVBLEtBQUtBO1lBQ3JCQSxXQUFXQSxFQUFFQSxLQUFLQTtZQUNsQkEsVUFBVUEsRUFBRUEsS0FBS0E7WUFDakJBLE9BQU9BLEVBQUVBLElBQUlBO1NBQ2RBLENBQUNBO1FBRUZBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25DQSxNQUFNQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxD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cENBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0QkEsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtnQkFDaENBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1lBQ2xDQSxDQUFDQTtZQUVEQSxBQUNBQSxZQURZQTtZQUNaQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxFQUFFQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtZQUNoREEsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFBRUEsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDakRBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLEVBQUVBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1lBRWpEQSxBQUNBQSxRQURRQTtZQUNSQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNsREEsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDdkRBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBQ3JEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQTtnQkFDbkJBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBRW5EQSxRQUFRQSxHQUFHQSxVQUFVQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7UUFFREEsQUFDQUEsb0NBRG9DQTtRQUNwQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFDakJBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1FBRWxDQSxBQUNBQSx1Q0FEdUNBO1FBQ3ZDQSxrQkFBTUE7WUFDSkEsS0FBS0EsRUFBRUEsVUFBVUE7WUFDakJBLE1BQU1BLEVBQUVBLFlBQVlBO1lBQ3BCQSxNQUFNQSxFQUFFQSxXQUFXQTtTQUNwQkEsQ0FBQ0EsQ0FBQ0E7UUFFSEEsQUFDQUEsVUFEVUE7UUFDVkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBQ0hELFdBQUNBO0FBQURBLENBOUhBLEFBOEhDQSxFQTlIeUIsT0FBTyxDQUFDLE9BQU8sRUE4SHhDO0FBOUhZLFlBQUksR0FBSixJQThIWixDQUFBO0FBQUEsQ0FBQyIsImZpbGUiOiJzcmMvYXJjaGl0ZWN0L0xTVE0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbmV0d29yayAgPSByZXF1aXJlKCcuLi9uZXR3b3JrJyk7XG5pbXBvcnQgdHJhaW5lciAgPSByZXF1aXJlKCcuLi90cmFpbmVyJyk7XG5pbXBvcnQgTGF5ZXIgID0gcmVxdWlyZSgnLi4vbGF5ZXInKTtcbmltcG9ydCBuZXVyb24gPSByZXF1aXJlKCcuLi9uZXVyb24nKTtcblxuZXhwb3J0IGNsYXNzIExTVE0gZXh0ZW5kcyBuZXR3b3JrLk5ldHdvcmsge1xuICB0cmFpbmVyOiB0cmFpbmVyLlRyYWluZXI7XG5cbiAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblxuICAgIGlmIChhcmdzLmxlbmd0aCA8IDMpXG4gICAgICB0aHJvdyBcIkVycm9yOiBub3QgZW5vdWdoIGxheWVycyAobWluaW11bSAzKSAhIVwiO1xuXG4gICAgdmFyIGxhc3QgPSBhcmdzLnBvcCgpO1xuICAgIHZhciBvcHRpb24gPSB7XG4gICAgICBwZWVwaG9sZXM6IExheWVyLkxheWVyLmNvbm5lY3Rpb25UeXBlLkFMTF9UT19BTEwsXG4gICAgICBoaWRkZW50b2hpZGRlbjogZmFsc2UsXG4gICAgICBvdXR0b2hpZGRlbjogZmFsc2UsXG4gICAgICBvdXR0b2dhdGVzOiBmYWxzZSxcbiAgICAgIGludG9vdXQ6IHRydWUsXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbGFzdCAhPSAnbnVtYmVyJykge1xuICAgICAgdmFyIG91dHB1dHMgPSBhcmdzLnBvcCgpO1xuICAgICAgaWYgKGxhc3QuaGFzT3duUHJvcGVydHkoJ3BlZXBob2xlcycpKVxuICAgICAgICBvcHRpb24ucGVlcGhvbGVzID0gbGFzdC5wZWVwaG9sZXM7XG4gICAgICBpZiAobGFzdC5oYXNPd25Qcm9wZXJ0eSgnaGlkZGVudG9oaWRkZW4nKSlcbiAgICAgICAgb3B0aW9uLmhpZGRlbnRvaGlkZGVuID0gbGFzdC5oaWRkZW50b2hpZGRlbjtcbiAgICAgIGlmIChsYXN0Lmhhc093blByb3BlcnR5KCdvdXR0b2hpZGRlbicpKVxuICAgICAgICBvcHRpb24ub3V0dG9oaWRkZW4gPSBsYXN0Lm91dHRvaGlkZGVuO1xuICAgICAgaWYgKGxhc3QuaGFzT3duUHJvcGVydHkoJ291dHRvZ2F0ZXMnKSlcbiAgICAgICAgb3B0aW9uLm91dHRvZ2F0ZXMgPSBsYXN0Lm91dHRvZ2F0ZXM7XG4gICAgICBpZiAobGFzdC5oYXNPd25Qcm9wZXJ0eSgnaW50b291dCcpKVxuICAgICAgICBvcHRpb24uaW50b291dCA9IGxhc3QuaW50b291dDtcbiAgICB9IGVsc2VcbiAgICAgIHZhciBvdXRwdXRzID0gbGFzdDtcblxuICAgIHZhciBpbnB1dHMgPSBhcmdzLnNoaWZ0KCk7XG4gICAgdmFyIGxheWVycyA9IGFyZ3M7XG5cbiAgICB2YXIgaW5wdXRMYXllciA9IG5ldyBMYXllci5MYXllcihpbnB1dHMpO1xuICAgIHZhciBoaWRkZW5MYXllcnMgPSBbXTtcbiAgICB2YXIgb3V0cHV0TGF5ZXIgPSBuZXcgTGF5ZXIuTGF5ZXIob3V0cHV0cyk7XG5cbiAgICB2YXIgcHJldmlvdXMgPSBudWxsO1xuXG4gICAgLy8gZ2VuZXJhdGUgbGF5ZXJzXG4gICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzKSB7XG4gICAgICAvLyBnZW5lcmF0ZSBtZW1vcnkgYmxvY2tzIChtZW1vcnkgY2VsbCBhbmQgcmVzcGVjdGl2ZSBnYXRlcylcbiAgICAgIHZhciBzaXplID0gbGF5ZXJzW2xheWVyXTtcblxuICAgICAgdmFyIGlucHV0R2F0ZSA9IG5ldyBMYXllci5MYXllcihzaXplKS5zZXQoe1xuICAgICAgICBiaWFzOiAxXG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JnZXRHYXRlID0gbmV3IExheWVyLkxheWVyKHNpemUpLnNldCh7XG4gICAgICAgIGJpYXM6IDFcbiAgICAgIH0pO1xuICAgICAgdmFyIG1lbW9yeUNlbGwgPSBuZXcgTGF5ZXIuTGF5ZXIoc2l6ZSk7XG4gICAgICB2YXIgb3V0cHV0R2F0ZSA9IG5ldyBMYXllci5MYXllcihzaXplKS5zZXQoe1xuICAgICAgICBiaWFzOiAxXG4gICAgICB9KTtcblxuICAgICAgaGlkZGVuTGF5ZXJzLnB1c2goaW5wdXRHYXRlKTtcbiAgICAgIGhpZGRlbkxheWVycy5wdXNoKGZvcmdldEdhdGUpO1xuICAgICAgaGlkZGVuTGF5ZXJzLnB1c2gobWVtb3J5Q2VsbCk7XG4gICAgICBoaWRkZW5MYXllcnMucHVzaChvdXRwdXRHYXRlKTtcblxuICAgICAgLy8gY29ubmVjdGlvbnMgZnJvbSBpbnB1dCBsYXllclxuICAgICAgdmFyIGlucHV0ID0gaW5wdXRMYXllci5wcm9qZWN0KG1lbW9yeUNlbGwpO1xuICAgICAgaW5wdXRMYXllci5wcm9qZWN0KGlucHV0R2F0ZSk7XG4gICAgICBpbnB1dExheWVyLnByb2plY3QoZm9yZ2V0R2F0ZSk7XG4gICAgICBpbnB1dExheWVyLnByb2plY3Qob3V0cHV0R2F0ZSk7XG5cbiAgICAgIC8vIGNvbm5lY3Rpb25zIGZyb20gcHJldmlvdXMgbWVtb3J5LWJsb2NrIGxheWVyIHRvIHRoaXMgb25lXG4gICAgICBpZiAocHJldmlvdXMgIT0gbnVsbCkge1xuICAgICAgICB2YXIgY2VsbCA9IHByZXZpb3VzLnByb2plY3QobWVtb3J5Q2VsbCk7XG4gICAgICAgIHByZXZpb3VzLnByb2plY3QoaW5wdXRHYXRlKTtcbiAgICAgICAgcHJldmlvdXMucHJvamVjdChmb3JnZXRHYXRlKTtcbiAgICAgICAgcHJldmlvdXMucHJvamVjdChvdXRwdXRHYXRlKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29ubmVjdGlvbnMgZnJvbSBtZW1vcnkgY2VsbFxuICAgICAgdmFyIG91dHB1dCA9IG1lbW9yeUNlbGwucHJvamVjdChvdXRwdXRMYXllcik7XG5cbiAgICAgIC8vIHNlbGYtY29ubmVjdGlvblxuICAgICAgdmFyIHNlbGYgPSBtZW1vcnlDZWxsLnByb2plY3QobWVtb3J5Q2VsbCk7XG5cbiAgICAgIC8vIGhpZGRlbiB0byBoaWRkZW4gcmVjdXJyZW50IGNvbm5lY3Rpb25cbiAgICAgIGlmIChvcHRpb24uaGlkZGVudG9oaWRkZW4pXG4gICAgICAgIG1lbW9yeUNlbGwucHJvamVjdChtZW1vcnlDZWxsLCBMYXllci5MYXllci5jb25uZWN0aW9uVHlwZS5BTExfVE9fRUxTRSk7XG5cbiAgICAgIC8vIG91dCB0byBoaWRkZW4gcmVjdXJyZW50IGNvbm5lY3Rpb25cbiAgICAgIGlmIChvcHRpb24ub3V0dG9oaWRkZW4pXG4gICAgICAgIG91dHB1dExheWVyLnByb2plY3QobWVtb3J5Q2VsbCk7XG5cbiAgICAgIC8vIG91dCB0byBnYXRlcyByZWN1cnJlbnQgY29ubmVjdGlvblxuICAgICAgaWYgKG9wdGlvbi5vdXR0b2dhdGVzKSB7XG4gICAgICAgIG91dHB1dExheWVyLnByb2plY3QoaW5wdXRHYXRlKTtcbiAgICAgICAgb3V0cHV0TGF5ZXIucHJvamVjdChvdXRwdXRHYXRlKTtcbiAgICAgICAgb3V0cHV0TGF5ZXIucHJvamVjdChmb3JnZXRHYXRlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gcGVlcGhvbGVzXG4gICAgICBtZW1vcnlDZWxsLnByb2plY3QoaW5wdXRHYXRlLCBvcHRpb24ucGVlcGhvbGVzKTtcbiAgICAgIG1lbW9yeUNlbGwucHJvamVjdChmb3JnZXRHYXRlLCBvcHRpb24ucGVlcGhvbGVzKTtcbiAgICAgIG1lbW9yeUNlbGwucHJvamVjdChvdXRwdXRHYXRlLCBvcHRpb24ucGVlcGhvbGVzKTtcblxuICAgICAgLy8gZ2F0ZXNcbiAgICAgIGlucHV0R2F0ZS5nYXRlKGlucHV0LCBMYXllci5MYXllci5nYXRlVHlwZS5JTlBVVCk7XG4gICAgICBmb3JnZXRHYXRlLmdhdGUoc2VsZiwgTGF5ZXIuTGF5ZXIuZ2F0ZVR5cGUuT05FX1RPX09ORSk7XG4gICAgICBvdXRwdXRHYXRlLmdhdGUob3V0cHV0LCBMYXllci5MYXllci5nYXRlVHlwZS5PVVRQVVQpO1xuICAgICAgaWYgKHByZXZpb3VzICE9IG51bGwpXG4gICAgICAgIGlucHV0R2F0ZS5nYXRlKGNlbGwsIExheWVyLkxheWVyLmdhdGVUeXBlLklOUFVUKTtcblxuICAgICAgcHJldmlvdXMgPSBtZW1vcnlDZWxsO1xuICAgIH1cblxuICAgIC8vIGlucHV0IHRvIG91dHB1dCBkaXJlY3QgY29ubmVjdGlvblxuICAgIGlmIChvcHRpb24uaW50b291dClcbiAgICAgIGlucHV0TGF5ZXIucHJvamVjdChvdXRwdXRMYXllcik7XG5cbiAgICAvLyBzZXQgdGhlIGxheWVycyBvZiB0aGUgbmV1cmFsIG5ldHdvcmtcbiAgICBzdXBlcih7XG4gICAgICBpbnB1dDogaW5wdXRMYXllcixcbiAgICAgIGhpZGRlbjogaGlkZGVuTGF5ZXJzLFxuICAgICAgb3V0cHV0OiBvdXRwdXRMYXllclxuICAgIH0pO1xuXG4gICAgLy8gdHJhaW5lclxuICAgIHRoaXMudHJhaW5lciA9IG5ldyB0cmFpbmVyLlRyYWluZXIodGhpcyk7XG4gIH1cbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=