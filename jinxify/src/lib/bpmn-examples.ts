/**
 * Simple order processing with collaboration
 * This example shows a collaboration between a customer and a supplier for processing an order
 */
export const SIMPLE_ORDER_PROCESSING_WITH_COLLABORATION = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
             targetNamespace="http://www.example.org/OrderProcess" 
             id="Definitions_1">
    <collaboration id="Collaboration_1">
        <participant id="Customer" processRef="Customer_Process" />
        <participant id="Supplier" processRef="Supplier_Process" />
        <messageFlow id="MessageFlow_1" sourceRef="SendOrder" targetRef="ReceiveOrder" />
        <messageFlow id="MessageFlow_2" sourceRef="SendConfirmation" targetRef="ReceiveConfirmation" />
    </collaboration>
    
    <process id="Customer_Process" isExecutable="false">
        <startEvent id="StartEvent_1" name="Order Placed">
            <outgoing>Flow_1</outgoing>
        </startEvent>
        <userTask id="SendOrder" name="Send Order">
            <incoming>Flow_1</incoming>
            <outgoing>Flow_2</outgoing>
        </userTask>
        <receiveTask id="ReceiveConfirmation" name="Receive Confirmation">
            <incoming>Flow_2</incoming>
            <outgoing>Flow_3</outgoing>
        </receiveTask>
        <endEvent id="EndEvent_1" name="Order Processed">
            <incoming>Flow_3</incoming>
        </endEvent>
        <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="SendOrder" />
        <sequenceFlow id="Flow_2" sourceRef="SendOrder" targetRef="ReceiveConfirmation" />
        <sequenceFlow id="Flow_3" sourceRef="ReceiveConfirmation" targetRef="EndEvent_1" />
    </process>

    <process id="Supplier_Process" isExecutable="true">
        <startEvent id="StartSupplierEvent" name="Receive Order">
            <outgoing>SupplierFlow_1</outgoing>
        </startEvent>
        <task id="ProcessOrder" name="Process Order">
            <incoming>SupplierFlow_1</incoming>
            <outgoing>SupplierFlow_2</outgoing>
        </task>
        <sendTask id="SendConfirmation" name="Send Confirmation">
            <incoming>SupplierFlow_2</incoming>
            <outgoing>SupplierFlow_3</outgoing>
        </sendTask>
        <endEvent id="SupplierEndEvent" name="Order Confirmed">
            <incoming>SupplierFlow_3</incoming>
        </endEvent>
        <sequenceFlow id="SupplierFlow_1" sourceRef="StartSupplierEvent" targetRef="ProcessOrder" />
        <sequenceFlow id="SupplierFlow_2" sourceRef="ProcessOrder" targetRef="SendConfirmation" />
        <sequenceFlow id="SupplierFlow_3" sourceRef="SendConfirmation" targetRef="SupplierEndEvent" />
    </process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
            <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1" isHorizontal="true">
                <dc:Bounds x="10" y="10" width="36" height="36"/>
            </bpmndi:BPMNShape>
            <!-- Add similar BPMNShape elements for each node -->
            <bpmndi:BPMNEdge id="BPMNEdge_Flow_1" bpmnElement="Flow_1">
                <di:waypoint x="46" y="28" />
                <di:waypoint x="150" y="28" />
            </bpmndi:BPMNEdge>
            <!-- Add BPMNEdge for each sequence flow -->
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</definitions>`;

/**
 * Manufacturing Process with Lanes
 * This example includes a manufacturing process divided into different departments using lanes
 */
export const MANUFACTURING_PROCESS_WITH_LANES = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
             targetNamespace="http://www.example.org/ManufacturingProcess" 
             id="Definitions_2">
    <process id="Manufacturing_Process" isExecutable="true">
        <laneSet id="LaneSet_1">
            <lane id="Design" name="Design">
                <flowNodeRef>DesignProduct</flowNodeRef>
            </lane>
            <lane id="Production" name="Production">
                <flowNodeRef>AssembleProduct</flowNodeRef>
                <flowNodeRef>QualityCheck</flowNodeRef>
            </lane>
            <lane id="Shipping" name="Shipping">
                <flowNodeRef>PackProduct</flowNodeRef>
                <flowNodeRef>ShipProduct</flowNodeRef>
            </lane>
        </laneSet>
        
        <startEvent id="StartManufacturing" name="Start Production">
            <outgoing>Flow_M_1</outgoing>
        </startEvent>
        <task id="DesignProduct" name="Design Product">
            <incoming>Flow_M_1</incoming>
            <outgoing>Flow_M_2</outgoing>
        </task>
        <task id="AssembleProduct" name="Assemble Product">
            <incoming>Flow_M_2</incoming>
            <outgoing>Flow_M_3</outgoing>
        </task>
        <task id="QualityCheck" name="Quality Check">
            <incoming>Flow_M_3</incoming>
            <outgoing>Flow_M_4</outgoing>
        </task>
        <task id="PackProduct" name="Pack Product">
            <incoming>Flow_M_4</incoming>
            <outgoing>Flow_M_5</outgoing>
        </task>
        <task id="ShipProduct" name="Ship Product">
            <incoming>Flow_M_5</incoming>
            <outgoing>Flow_M_6</outgoing>
        </task>
        <endEvent id="EndManufacturing" name="Product Delivered">
            <incoming>Flow_M_6</incoming>
        </endEvent>
        
        <sequenceFlow id="Flow_M_1" sourceRef="StartManufacturing" targetRef="DesignProduct" />
        <sequenceFlow id="Flow_M_2" sourceRef="DesignProduct" targetRef="AssembleProduct" />
        <sequenceFlow id="Flow_M_3" sourceRef="AssembleProduct" targetRef="QualityCheck" />
        <sequenceFlow id="Flow_M_4" sourceRef="QualityCheck" targetRef="PackProduct" />
        <sequenceFlow id="Flow_M_5" sourceRef="PackProduct" targetRef="ShipProduct" />
        <sequenceFlow id="Flow_M_6" sourceRef="ShipProduct" targetRef="EndManufacturing" />
    </process>

    <bpmndi:BPMNDiagram id="BPMNDiagram_Manufacturing">
        <bpmndi:BPMNPlane bpmnElement="Manufacturing_Process" id="BPMNPlane_Manufacturing">
            <!-- Lanes -->
            <bpmndi:BPMNShape bpmnElement="Design" isHorizontal="true" id="Design_di">
                <dc:Bounds x="10" y="10" width="980" height="150"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="Production" isHorizontal="true" id="Production_di">
                <dc:Bounds x="10" y="160" width="980" height="150"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="Shipping" isHorizontal="true" id="Shipping_di">
                <dc:Bounds x="10" y="310" width="980" height="150"/>
            </bpmndi:BPMNShape>

            <!-- Start Event -->
            <bpmndi:BPMNShape bpmnElement="StartManufacturing" id="StartManufacturing_di">
                <dc:Bounds x="100" y="80" width="36" height="36"/>
            </bpmndi:BPMNShape>

            <!-- Tasks -->
            <bpmndi:BPMNShape bpmnElement="DesignProduct" id="DesignProduct_di">
                <dc:Bounds x="200" y="50" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="AssembleProduct" id="AssembleProduct_di">
                <dc:Bounds x="200" y="200" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="QualityCheck" id="QualityCheck_di">
                <dc:Bounds x="400" y="200" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="PackProduct" id="PackProduct_di">
                <dc:Bounds x="200" y="350" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="ShipProduct" id="ShipProduct_di">
                <dc:Bounds x="400" y="350" width="100" height="80"/>
            </bpmndi:BPMNShape>

            <!-- End Event -->
            <bpmndi:BPMNShape bpmnElement="EndManufacturing" id="EndManufacturing_di">
                <dc:Bounds x="600" y="360" width="36" height="36"/>
            </bpmndi:BPMNShape>

            <!-- Sequence Flows -->
            <bpmndi:BPMNEdge bpmnElement="Flow_M_1" id="Flow_M_1_di">
                <di:waypoint x="136" y="98"/>
                <di:waypoint x="200" y="90"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="Flow_M_2" id="Flow_M_2_di">
                <di:waypoint x="300" y="90"/>
                <di:waypoint x="300" y="150"/>
                <di:waypoint x="200" y="240"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="Flow_M_3" id="Flow_M_3_di">
                <di:waypoint x="300" y="240"/>
                <di:waypoint x="400" y="240"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="Flow_M_4" id="Flow_M_4_di">
                <di:waypoint x="500" y="240"/>
                <di:waypoint x="500" y="300"/>
                <di:waypoint x="200" y="390"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="Flow_M_5" id="Flow_M_5_di">
                <di:waypoint x="300" y="390"/>
                <di:waypoint x="400" y="390"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="Flow_M_6" id="Flow_M_6_di">
                <di:waypoint x="500" y="390"/>
                <di:waypoint x="618" y="378"/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</definitions>`;

/**
 * Process for making coffee
 * This example shows a simple process for making coffee
 */
export const COFFEE_MAKING_PROCESS = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="http://www.example.org/CoffeeMaking" id="Definitions_Coffee">
    
    <process id="CoffeeProcess" name="Coffee Making Process" isExecutable="true">
        <startEvent id="StartEvent_1" name="Start">
            <outgoing>Flow_1</outgoing>
        </startEvent>
        <task id="MakeCoffee" name="Brew Coffee">
            <incoming>Flow_1</incoming>
            <outgoing>Flow_2</outgoing>
        </task>
        <endEvent id="EndEvent_1" name="Drink">
            <incoming>Flow_2</incoming>
        </endEvent>
        <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="MakeCoffee" />
        <sequenceFlow id="Flow_2" sourceRef="MakeCoffee" targetRef="EndEvent_1" />
    </process>

    <!-- BPMN DI (Diagram Interchange) -->
    <bpmndi:BPMNDiagram id="BPMNDiagram_Coffee">
        <bpmndi:BPMNPlane bpmnElement="CoffeeProcess" id="BPMNPlane_Coffee">
            <!-- Start Event -->
            <bpmndi:BPMNShape bpmnElement="StartEvent_1" id="StartEvent_1_di">
                <dc:Bounds x="100" y="100" width="36" height="36"/>
            </bpmndi:BPMNShape>

            <!-- Task -->
            <bpmndi:BPMNShape bpmnElement="MakeCoffee" id="MakeCoffee_di">
                <dc:Bounds x="200" y="80" width="100" height="80"/>
            </bpmndi:BPMNShape>

            <!-- End Event -->
            <bpmndi:BPMNShape bpmnElement="EndEvent_1" id="EndEvent_1_di">
                <dc:Bounds x="350" y="100" width="36" height="36"/>
            </bpmndi:BPMNShape>

            <!-- Sequence Flows -->
            <bpmndi:BPMNEdge bpmnElement="Flow_1" id="Flow_1_di">
                <di:waypoint x="136" y="118"/>
                <di:waypoint x="200" y="120"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="Flow_2" id="Flow_2_di">
                <di:waypoint x="300" y="120"/>
                <di:waypoint x="350" y="118"/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>

</definitions>`;

export const PIZZA_ORDER_PROCESSING_WITH_POOLS_COMPLICATED = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" id="definitions" targetNamespace="http://bpmn.io/schema/bpmn">
  <collaboration id="Collaboration_1">
    <participant id="Customer" name="Customer" processRef="CustomerProcess" />
    <participant id="PizzaPlace" name="Pizza Place" processRef="PizzaPlaceProcess" />
    <messageFlow id="Flow_0fx6app" sourceRef="SendOrder" targetRef="StartPizzaPlace" />
    <messageFlow id="Flow_19849sg" sourceRef="ConfirmOrder" targetRef="ReceiveConfirmation" />
  </collaboration>
  <process id="CustomerProcess" isExecutable="false">
    <startEvent id="StartCustomer" name="Decide to Order Pizza" />
    <userTask id="SelectPizza" name="Select Pizza" />
    <userTask id="EnterDetails" name="Enter Delivery Details" />
    <userTask id="Payment" name="Payment" />
    <sendTask id="SendOrder" name="Send Order Details" />
    <receiveTask id="ReceiveConfirmation" name="Receive Confirmation" />
    <endEvent id="EndCustomer" name="Wait for Delivery" />
    <sequenceFlow id="flow1" sourceRef="StartCustomer" targetRef="SelectPizza" />
    <sequenceFlow id="flow2" sourceRef="SelectPizza" targetRef="EnterDetails" />
    <sequenceFlow id="flow3" sourceRef="EnterDetails" targetRef="Payment" />
    <sequenceFlow id="flow4" sourceRef="Payment" targetRef="SendOrder" />
    <sequenceFlow id="flow5" sourceRef="SendOrder" targetRef="ReceiveConfirmation" />
    <sequenceFlow id="flow6" sourceRef="ReceiveConfirmation" targetRef="EndCustomer" />
  </process>
  <process id="PizzaPlaceProcess" isExecutable="false">
    <sequenceFlow id="flow7" sourceRef="StartPizzaPlace" targetRef="ReceiveOrder" />
    <sequenceFlow id="flow9" sourceRef="VerifyOrder" targetRef="ConfirmOrder" />
    <sequenceFlow id="flow14" sourceRef="AssignDelivery" targetRef="Delivery" />
    <sequenceFlow id="flow15" sourceRef="Delivery" targetRef="UpdateDelivery" />
    <sequenceFlow id="flow16" sourceRef="UpdateDelivery" targetRef="EndPizzaPlace" />
    <sequenceFlow id="flow11" sourceRef="PreparePizza" targetRef="QualityCheck" />
    <sequenceFlow id="flow12" sourceRef="QualityCheck" targetRef="PackagePizza" />
    <sequenceFlow id="Flow_03650n9" sourceRef="ReceiveOrder" targetRef="VerifyOrder" />
    <receiveTask id="ReceiveOrder" name="Receive Order Details">
      <outgoing>Flow_03650n9</outgoing>
    </receiveTask>
    <serviceTask id="VerifyOrder" name="Verify Order">
      <incoming>Flow_03650n9</incoming>
    </serviceTask>
    <sendTask id="ConfirmOrder" name="Confirm Order">
      <outgoing>Flow_0d7orcr</outgoing>
    </sendTask>
    <startEvent id="StartPizzaPlace" name="Receive Order">
      <outgoing>flow7</outgoing>
      <messageEventDefinition id="MessageEventDefinition_0y1lvur" />
    </startEvent>
    <manualTask id="QualityCheck" name="Quality Check" />
    <manualTask id="PackagePizza" name="Package Pizza">
      <outgoing>Flow_0gtwpp8</outgoing>
    </manualTask>
    <manualTask id="PreparePizza" name="Prepare Pizza">
      <incoming>Flow_0d7orcr</incoming>
    </manualTask>
    <endEvent id="EndPizzaPlace" name="Delivery Completed" />
    <serviceTask id="Delivery" name="Delivery" />
    <sendTask id="UpdateDelivery" name="Update Delivery Status" />
    <serviceTask id="AssignDelivery" name="Assign Delivery Person">
      <incoming>Flow_0gtwpp8</incoming>
    </serviceTask>
    <sequenceFlow id="Flow_0d7orcr" sourceRef="ConfirmOrder" targetRef="PreparePizza" />
    <sequenceFlow id="Flow_0gtwpp8" sourceRef="PackagePizza" targetRef="AssignDelivery" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
      <bpmndi:BPMNShape id="CustomerShape" bpmnElement="Customer" isHorizontal="true">
        <omgdc:Bounds x="-180" y="-70" width="1180" height="260" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartCustomerShape" bpmnElement="StartCustomer">
        <omgdc:Bounds x="-65" y="45" width="30" height="30" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-89" y="7.5" width="78" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SelectPizzaShape" bpmnElement="SelectPizza">
        <omgdc:Bounds x="10" y="35" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EnterDetailsShape" bpmnElement="EnterDetails">
        <omgdc:Bounds x="160" y="35" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="PaymentShape" bpmnElement="Payment">
        <omgdc:Bounds x="320" y="35" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SendOrderShape" bpmnElement="SendOrder">
        <omgdc:Bounds x="490" y="35" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ReceiveConfirmationShape" bpmnElement="ReceiveConfirmation">
        <omgdc:Bounds x="650" y="35" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndCustomerShape" bpmnElement="EndCustomer">
        <omgdc:Bounds x="825" y="45" width="30" height="30" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="800" y="75" width="81" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="flow1_edge" bpmnElement="flow1">
        <omgdi:waypoint x="-35" y="60" />
        <omgdi:waypoint x="10" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow2_edge" bpmnElement="flow2">
        <omgdi:waypoint x="110" y="60" />
        <omgdi:waypoint x="160" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow3_edge" bpmnElement="flow3">
        <omgdi:waypoint x="260" y="60" />
        <omgdi:waypoint x="320" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow4_edge" bpmnElement="flow4">
        <omgdi:waypoint x="420" y="60" />
        <omgdi:waypoint x="490" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow5_edge" bpmnElement="flow5">
        <omgdi:waypoint x="590" y="60" />
        <omgdi:waypoint x="650" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow6_edge" bpmnElement="flow6">
        <omgdi:waypoint x="750" y="60" />
        <omgdi:waypoint x="825" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="PizzaPlaceShape" bpmnElement="PizzaPlace" isHorizontal="true">
        <omgdc:Bounds x="-190" y="260" width="1190" height="450" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ReceiveOrderShape" bpmnElement="ReceiveOrder">
        <omgdc:Bounds x="130" y="295" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="VerifyOrderShape" bpmnElement="VerifyOrder">
        <omgdc:Bounds x="360" y="295" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ConfirmOrderShape" bpmnElement="ConfirmOrder">
        <omgdc:Bounds x="570" y="295" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0ohm2yw_di" bpmnElement="StartPizzaPlace">
        <omgdc:Bounds x="-88" y="305" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-106" y="346" width="72" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="QualityCheckShape" bpmnElement="QualityCheck">
        <omgdc:Bounds x="260" y="445" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="PackagePizzaShape" bpmnElement="PackagePizza">
        <omgdc:Bounds x="570" y="445" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="PreparePizzaShape" bpmnElement="PreparePizza">
        <omgdc:Bounds x="0" y="445" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndPizzaPlaceShape" bpmnElement="EndPizzaPlace">
        <omgdc:Bounds x="735" y="595" width="30" height="30" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="723" y="625" width="54" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="DeliveryShape" bpmnElement="Delivery">
        <omgdc:Bounds x="210" y="585" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UpdateDeliveryShape" bpmnElement="UpdateDelivery">
        <omgdc:Bounds x="440" y="585" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="AssignDeliveryShape" bpmnElement="AssignDelivery">
        <omgdc:Bounds x="-10" y="585" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="flow7_edge" bpmnElement="flow7">
        <omgdi:waypoint x="-52" y="320" />
        <omgdi:waypoint x="130" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow9_edge" bpmnElement="flow9">
        <omgdi:waypoint x="460" y="320" />
        <omgdi:waypoint x="570" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow14_edge" bpmnElement="flow14">
        <omgdi:waypoint x="90" y="610" />
        <omgdi:waypoint x="210" y="610" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow15_edge" bpmnElement="flow15">
        <omgdi:waypoint x="310" y="610" />
        <omgdi:waypoint x="440" y="610" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow16_edge" bpmnElement="flow16">
        <omgdi:waypoint x="540" y="610" />
        <omgdi:waypoint x="735" y="610" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow11_edge" bpmnElement="flow11">
        <omgdi:waypoint x="100" y="470" />
        <omgdi:waypoint x="260" y="470" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="flow12_edge" bpmnElement="flow12">
        <omgdi:waypoint x="360" y="470" />
        <omgdi:waypoint x="570" y="470" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_03650n9_di" bpmnElement="Flow_03650n9">
        <omgdi:waypoint x="230" y="320" />
        <omgdi:waypoint x="360" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0d7orcr_di" bpmnElement="Flow_0d7orcr">
        <omgdi:waypoint x="670" y="320" />
        <omgdi:waypoint x="720" y="320" />
        <omgdi:waypoint x="720" y="400" />
        <omgdi:waypoint x="-60" y="400" />
        <omgdi:waypoint x="-60" y="470" />
        <omgdi:waypoint x="0" y="470" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0gtwpp8_di" bpmnElement="Flow_0gtwpp8">
        <omgdi:waypoint x="620" y="495" />
        <omgdi:waypoint x="620" y="540" />
        <omgdi:waypoint x="-60" y="540" />
        <omgdi:waypoint x="-60" y="610" />
        <omgdi:waypoint x="-10" y="610" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0fx6app_di" bpmnElement="Flow_0fx6app">
        <omgdi:waypoint x="540" y="85" />
        <omgdi:waypoint x="540" y="220" />
        <omgdi:waypoint x="-73" y="220" />
        <omgdi:waypoint x="-73" y="306" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_19849sg_di" bpmnElement="Flow_19849sg">
        <omgdi:waypoint x="620" y="295" />
        <omgdi:waypoint x="620" y="220" />
        <omgdi:waypoint x="690" y="220" />
        <omgdi:waypoint x="690" y="85" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;

/**
 * ### Pizza Order Process

#### User asks

\`\`\`txt
The pizza delivery process involves two main participants: the customer and the pizza place. It begins when the customer decides to order pizza, placing an order which includes selecting the type of pizza and providing delivery details. This order is then sent to the pizza place where it is received and confirmed. While the customer waits for their order, the pizza place gets to work, preparing the pizza. Once the pizza is ready, it's delivered to the customer's address, marking the end of the process for the customer with the receipt of their meal. Throughout this process, there are key moments of interaction where the pizza place confirms the order and updates the customer about the delivery status.
\`\`\`

#### Assistant responds with the business process to model using the BPMN 2.0 standard terms.

\`\`\`txt
### Pizza Order Process

#### Customer Process:

Starts with a Desire: The customer decides they want to order pizza.
Place Order: The customer places their order, choosing the pizza and providing delivery details.
Waiting: After placing the order, the customer waits for the pizza place to confirm the order.
Ends with Delivery: The process concludes when the pizza is delivered to the customer.

#### Pizza Place Process:

Receives Order: The pizza place receives the order from the customer.
Confirm Order: They confirm the order details, ensuring everything is correct.
Make Pizza: The pizza is prepared in the kitchen.
Deliver Pizza: Once prepared, the pizza is delivered to the customer's address.

#### Interaction Between Customer and Pizza Place:

Ordering: The customer sends the order to the pizza place.
Confirmation: The pizza place sends back a confirmation to the customer that the order has been accepted.
Delivery Notification: Finally, the pizza place communicates when the pizza is on its way or has been delivered.
 */
export const PIZZA_ORDERING_SIMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <collaboration id="Collaboration_1">
    <participant id="CustomerPool" name="Customer" processRef="CustomerProcess" />
    <participant id="PizzaPlacePool" name="Pizza Place" processRef="PizzaPlaceProcess" />
    <messageFlow id="Flow_1vurx1i" sourceRef="OrderTask" targetRef="StartEvent_2" />
    <messageFlow id="Flow_0jc3v1j" sourceRef="ConfirmTask" targetRef="Event_0k5noln" />
    <messageFlow id="Flow_1kne4x6" sourceRef="DeliverTask" targetRef="Activity_1dpdsxo" />
  </collaboration>
  <process id="CustomerProcess" isExecutable="false">
    <sequenceFlow id="Flow_1g4bd6i" sourceRef="OrderTask" targetRef="Event_0k5noln" />
    <sequenceFlow id="Flow1" sourceRef="StartEvent_1" targetRef="OrderTask" />
    <intermediateCatchEvent id="Event_0k5noln" name="Wait for confirmation">
      <incoming>Flow_1g4bd6i</incoming>
      <outgoing>Flow_1951hic</outgoing>
      <messageEventDefinition id="MessageEventDefinition_1vy3u1a" />
    </intermediateCatchEvent>
    <sendTask id="OrderTask" name="Place Order">
      <incoming>Flow1</incoming>
      <outgoing>Flow_1g4bd6i</outgoing>
    </sendTask>
    <startEvent id="StartEvent_1" name="Wants Pizza" />
    <sequenceFlow id="Flow_1951hic" sourceRef="Event_0k5noln" targetRef="Activity_1dpdsxo" />
    <sequenceFlow id="Flow_0h4sjqw" sourceRef="Activity_1dpdsxo" targetRef="EndEvent_1" />
    <receiveTask id="Activity_1dpdsxo" name="Receive Pizza">
      <incoming>Flow_1951hic</incoming>
      <outgoing>Flow_0h4sjqw</outgoing>
    </receiveTask>
    <endEvent id="EndEvent_1" name="Eat Pizza">
      <incoming>Flow_0h4sjqw</incoming>
    </endEvent>
  </process>
  <process id="PizzaPlaceProcess" isExecutable="false">
    <sequenceFlow id="Flow4" sourceRef="StartEvent_2" targetRef="ConfirmTask" />
    <sequenceFlow id="Flow5" sourceRef="ConfirmTask" targetRef="MakeTask" />
    <sequenceFlow id="Flow6" sourceRef="MakeTask" targetRef="DeliverTask" />
    <sequenceFlow id="Flow7" sourceRef="DeliverTask" targetRef="EndEvent_2" />
    <serviceTask id="MakeTask" name="Make Pizza" />
    <sendTask id="ConfirmTask" name="Confirm Order">
      <incoming>Flow4</incoming>
      <outgoing>Flow5</outgoing>
    </sendTask>
    <startEvent id="StartEvent_2" name="Receive Order" />
    <sendTask id="DeliverTask" name="Deliver Pizza">
      <incoming>Flow6</incoming>
      <outgoing>Flow7</outgoing>
    </sendTask>
    <endEvent id="EndEvent_2" name="Delivery Complete" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
      <bpmndi:BPMNShape id="CustomerPool_di" bpmnElement="CustomerPool" isHorizontal="true">
        <omgdc:Bounds x="-30" y="10" width="760" height="190" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <omgdc:Bounds x="42" y="80" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="29" y="116" width="62" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_000m2yy_di" bpmnElement="OrderTask">
        <omgdc:Bounds x="120" y="60" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0weq2x2_di" bpmnElement="Event_0k5noln">
        <omgdc:Bounds x="302" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="290" y="46" width="60" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0suelqb_di" bpmnElement="Activity_1dpdsxo">
        <omgdc:Bounds x="460" y="60" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <omgdc:Bounds x="642" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="637" y="125" width="48" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow1_di" bpmnElement="Flow1">
        <omgdi:waypoint x="78" y="98" />
        <omgdi:waypoint x="120" y="98" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1g4bd6i_di" bpmnElement="Flow_1g4bd6i">
        <omgdi:waypoint x="220" y="100" />
        <omgdi:waypoint x="302" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1951hic_di" bpmnElement="Flow_1951hic">
        <omgdi:waypoint x="338" y="100" />
        <omgdi:waypoint x="460" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0h4sjqw_di" bpmnElement="Flow_0h4sjqw">
        <omgdi:waypoint x="560" y="100" />
        <omgdi:waypoint x="642" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="PizzaPlacePool_di" bpmnElement="PizzaPlacePool" isHorizontal="true">
        <omgdc:Bounds x="-30" y="260" width="760" height="180" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="MakeTask_di" bpmnElement="MakeTask">
        <omgdc:Bounds x="300" y="308" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0615dhg_di" bpmnElement="ConfirmTask">
        <omgdc:Bounds x="150" y="308" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_2_di" bpmnElement="StartEvent_2">
        <omgdc:Bounds x="50" y="328" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="32" y="364" width="72" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_19cfvwf_di" bpmnElement="DeliverTask">
        <omgdc:Bounds x="460" y="308" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_2_di" bpmnElement="EndEvent_2">
        <omgdc:Bounds x="632" y="328" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="605" y="371" width="90" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow4_di" bpmnElement="Flow4">
        <omgdi:waypoint x="86" y="346" />
        <omgdi:waypoint x="150" y="346" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow5_di" bpmnElement="Flow5">
        <omgdi:waypoint x="250" y="346" />
        <omgdi:waypoint x="300" y="346" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow6_di" bpmnElement="Flow6">
        <omgdi:waypoint x="400" y="346" />
        <omgdi:waypoint x="460" y="346" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow7_di" bpmnElement="Flow7">
        <omgdi:waypoint x="560" y="346" />
        <omgdi:waypoint x="632" y="346" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1vurx1i_di" bpmnElement="Flow_1vurx1i">
        <omgdi:waypoint x="170" y="140" />
        <omgdi:waypoint x="170" y="235" />
        <omgdi:waypoint x="68" y="235" />
        <omgdi:waypoint x="68" y="328" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0jc3v1j_di" bpmnElement="Flow_0jc3v1j">
        <omgdi:waypoint x="200" y="308" />
        <omgdi:waypoint x="200" y="213" />
        <omgdi:waypoint x="320" y="213" />
        <omgdi:waypoint x="320" y="118" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1kne4x6_di" bpmnElement="Flow_1kne4x6">
        <omgdi:waypoint x="510" y="308" />
        <omgdi:waypoint x="510" y="140" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;
