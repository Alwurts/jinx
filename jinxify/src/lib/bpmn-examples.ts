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
        `;

/**
 * Process for making coffee
 * This example shows a simple process for making coffee
 */
export const COFFEE_MAKING_PROCESS = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="http://www.example.org/CoffeeMaking" id="Definitions_Coffee">
    
    <process id="CoffeeProcess" 
        name="Coffee Making Process" 
        isExecutable="true">
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
